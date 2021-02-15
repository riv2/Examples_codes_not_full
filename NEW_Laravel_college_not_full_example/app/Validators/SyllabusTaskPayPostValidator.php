<?php
/**
 * User: Viktor Schepkin
 * Date: 2019-12-18
 * Time: 15:25
 */

namespace App\Validators;

use Illuminate\Support\Facades\Validator;

class SyllabusTaskPayPostValidator extends Validator
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
                'task_id' => 'required|integer'
            ];

        return parent::make($aData, $aRuleList, $aMessageList, $aCustomAttributeList);
    }

}