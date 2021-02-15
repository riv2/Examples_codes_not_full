<?php
/**
 * User: dadicc
 * Date: 3/9/20
 * Time: 4:57 PM
 */

namespace App\Validators;

use Illuminate\Support\Facades\Validator;

class AdminCheckListEditPostValidator extends Validator
{

    /**
     * validation data
     * @param array $aData
     * @param array|null $aRuleList
     * @param array $aMessageList
     * @param array $aCustomAttributeList
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public static function make(array $aData, array $aRuleList = null, array $aMessageList = [], array $aCustomAttributeList = [])
    {

        $aRuleList = $aRuleList ? $aRuleList :
            [
                '_token'       => 'required',
                'year'         => 'required|string|max:4',
            ];

        return parent::make($aData, $aRuleList, $aMessageList, $aCustomAttributeList);
    }

}