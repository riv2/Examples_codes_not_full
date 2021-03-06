(function(netis, $, undefined) {
    'use strict';
    /** @const */
    var MODE_NEW_RECORD = 1;
    /** @const */
    var MODE_EXISTING_RECORD = 2;
    var defaults = {
            modalId: '#relationModal',
            saveButtonId: '#relationSave',
            i18n: {
                loadingText: 'Loading, please wait.'
            },
            compositeKeySeparator: '-',
            keysSeparator: ','
        },
        _settings,
        _mode,
        _selectionFields,
        _container;

    netis.init = function(settings) {
        _settings = $.extend({}, defaults, settings);

        $(document).off('pjax:timeout', _settings.modalId).on('pjax:timeout', _settings.modalId, function(event) {
            event.preventDefault();
        });
        $(document).off('pjax:error', _settings.modalId)
            .on('pjax:error', _settings.modalId, netis.pjaxError);
        //$(document).on('pjax:send', settings.modalId, function() { })
        //$(document).on('pjax:complete', settings.modalId, function() { })

        $(_settings.modalId).off('show.bs.modal').on('show.bs.modal', netis.showModal);
        $(_settings.modalId).off('hide.bs.modal').on('hide.bs.modal', netis.hideModal);

        var saveButton = $(_settings.saveButtonId);
        saveButton.off('click').on('click', netis.saveRelation);

        $('.relations-panel .tab-pane').off('click', 'a.remove').on('click', 'a.remove', function(event) {
            var key = $(this).parent().closest('tr').data('key');
            netis.removeRelation($(event.delegateTarget).children('div'), key);
            event.preventDefault();
            return false;
        });
    };

    netis.hideModal = function() {
        _mode = undefined;
        _selectionFields = undefined;
        _container = undefined;
        $('.modal-body', this).empty();
        $(_settings.saveButtonId).removeData('primaryKey');
    };

    netis.showModal = function(event) {
        var modal = $(this),
            clicked = $(event.relatedTarget),
            container = _settings.modalId + ' .modal-body',
            options = {
                'push': false,
                'replace': false,
                'scrollTo': false
            },
            target, title, relation, url;
        if (clicked.is('a')) {
            // clicked on a new/update link button for a hasMany relation
            relation = clicked.data('relation');
            title = clicked.data('title');
            url = clicked.data('pjax-url');
            _mode = clicked.data('mode');
            target = '#' + relation + 'Pjax';
        } else {
            // clicked on a select list option for a hasOne relation
            relation = modal.data('relation');
            title = modal.data('title');
            url = modal.data('pjax-url');
            _mode = modal.data('mode');
            target = '#' + modal.data('target');
        }
        _container = $(target);
        var fieldsSelectors = $(target).data('selectionFields');
        if (fieldsSelectors !== undefined) {
            //save references to selection fields because new modal content could have fields with same selectors
            _selectionFields = {
                add: $(fieldsSelectors.add),
                remove: $(fieldsSelectors.remove)
            };
        }

        modal.find('.modal-title').text(title);
        modal.find('.modal-body').text(_settings.i18n.loadingText);
        $(_settings.saveButtonId).data('target', target);

        $(document).off('click.pjax', container + ' a');
        $(document).off('submit', container + ' form');

        $(document).pjax(container + ' a', container, options);
        $(document).on('submit', container + ' form', function(event) {
            $.pjax.submit(event, container, options);
        });
        $(document).off('pjax:success', _settings.modalId);
        $(document).on('pjax:success', _settings.modalId, netis.pjaxSuccess);
        $.pjax.reload(container, {
            'url': url,
            'push': false,
            'replace': false
        });
    };

    netis.pjaxError = function (event, textStatus, error, options) {
        $('.modal-title', this).text(textStatus.statusText);
        $('.modal-body', this).html(textStatus.responseText);

        //prevent hard reload on error
        event.preventDefault();
    };

    netis.pjaxSuccess = function (event, data, status, xhr, options) {
        var saveButton = $(_settings.saveButtonId),
            added = [],
            removed = [],
            grid = $(_settings.modalId + ' .grid-view');

        if (_selectionFields !== undefined) {
            added = netis.explodeKeys(_selectionFields.add.val());
            removed = netis.explodeKeys(_selectionFields.remove.val());
        }

        if (_mode === MODE_EXISTING_RECORD && grid.length) {
            grid.find("input[name='selection[]']").each(function() {
                var key = $(this).parent().closest('tr').data('key').toString();
                if ($.inArray(key, added) !== -1) {
                    $(this).prop('disabled', true).prop('checked', true);
                } else if ($.inArray(key, removed) !== -1) {
                    $(this).prop('disabled', false).prop('checked', false);
                }
            });
            //$(document).off('pjax:success', settings.modalId);
            /* the following should not be necessary after changing renderPartial to renderAjax in ActiveController.afterAction
             grid.yiiGridView({
             'filterUrl': url,
             'filterSelector': '#relationGrid-quickSearch'
             });
             grid.yiiGridView('setSelectionColumn', {
             'name': 'selection[]',
             'multiple': true,
             'checkAll': 'selection_all'
             });*/
        } else {
            if (xhr.getResponseHeader('X-Primary-Key')) {
                saveButton.data('primaryKey', xhr.getResponseHeader('X-Primary-Key'));
                netis.saveRelation(event);
                return;
            }
            $(_settings.modalId + ' h1').remove();
            $(_settings.modalId + ' .form-buttons').remove();
        }
    };

    netis.saveRelation = function(event) {
        var saveButton = $(_settings.saveButtonId),
            grid = $(_settings.modalId + ' .grid-view'),
            add = [],
            remove = [];

        if (_selectionFields !== undefined) {
            add = netis.explodeKeys(_selectionFields.add.val());
            remove = netis.explodeKeys(_selectionFields.remove.val());
        }

        if (_mode === MODE_EXISTING_RECORD && grid.length) {
            grid.find("input[name='selection[]']:checked").not(':disabled').each(function () {
                var key = $(this).parent().closest('tr').data('key').toString(),
                    idx = $.inArray(key, remove);
                if (idx !== -1) {
                    remove.splice(idx, 1);
                } else {
                    add.push(key);
                }
            });
        } else {
            if (saveButton.data('primaryKey') === undefined) {
                $(_settings.modalId + ' form').submit();
                return;
            }
            add.push(saveButton.data('primaryKey'));
        }

        if (_selectionFields !== undefined) {
            _selectionFields.add.val(netis.implodeKeys(add));
            _selectionFields.remove.val(netis.implodeKeys(remove));
            $.pjax.reload(_container);
        } else {
            _container.select2('val', add);
        }

        $(_settings.modalId).modal('hide');
    };

    netis.removeRelation = function(container, key) {
        var add = netis.explodeKeys($(container.data('selectionFields').add).val()),
            remove = netis.explodeKeys($(container.data('selectionFields').remove).val()),
            idx = $.inArray(key.toString(), add);
        if (idx !== -1) {
            add.splice(idx, 1);
        }
        if ($.inArray(key.toString(), remove) === -1) {
            remove.push(key);
        }

        $(container.data('selectionFields').add).val(netis.implodeKeys(add));
        $(container.data('selectionFields').remove).val(netis.implodeKeys(remove));
        $.pjax.reload(container);
    };

    netis.implodeEscaped = function(glue, pieces, escapeChar) {
        if (escapeChar === undefined) {
            escapeChar = '\\';
        }
        var glueRegExp = new RegExp(netis.escapeRegex(glue), "g");
        var escapeCharRegExp = new RegExp(netis.escapeRegex(escapeChar), "g");
        return $.map(pieces, function(k) {
            return String(k).replace(escapeCharRegExp, escapeChar + escapeChar).replace(glueRegExp, escapeChar + glue);
        }).join(glue);
    };

    netis.implodeKeys = function (pieces) {
        var glue = _settings.keysSeparator || ',';

        pieces = $.map(pieces, function (v) {
            return $.trim(v) === '' ? null : v;
        });

        return netis.implodeEscaped(glue, pieces);
    };

    /**
     * Splits a string into elements handling an escaped delimiter.
     *
     * FIXME This function fails for string: such as 'a\\,b\\' where \ is escape char and , is delimiter. It returns ['a\,b\']
     * but should return ['a\','b\']. If string is 'a\\b,c\\d' it works ok and returns ['a\b', 'c\d'].
     *
     * @param delimiter
     * @param string
     * @param escapeChar
     * @returns {Array}
     */
    netis.explodeEscaped = function(delimiter, string, escapeChar) {
        if (escapeChar === undefined) {
            escapeChar = '\\';
        }
        var lastIndex = -1,
            prevIndex = -1,
            result = [];
        var escapeRegExp = new RegExp(netis.escapeRegex(escapeChar) + '(.)', 'g');
        while ((lastIndex = string.indexOf(delimiter, lastIndex + 1)) > -1) {
            if (string[lastIndex - 1] === escapeChar) {
                continue;
            }
            if (lastIndex - prevIndex + 1 > 0) {
                result.push(string.substring(prevIndex + 1, lastIndex).replace(escapeRegExp, '$1'));
            }
            prevIndex = lastIndex;
        }
        if (string.length - prevIndex + 1 > 0) {
            result.push(string.substring(prevIndex + 1).replace(escapeRegExp, '$1'));
        }

        return result;
    };

    netis.explodeKeys = function (string) {
        var delimiter = _settings.keysSeparator || ',';

        var pieces = netis.explodeEscaped(delimiter, string);

        return $.map(pieces, function (v) {
            return $.trim(v) === '' ? null : v;
        });
    };

    netis.escapeRegex = function(str) {
        return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };
}(window.netis = window.netis || {}, jQuery));
