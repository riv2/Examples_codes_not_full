<?php

use Illuminate\Database\Seeder;

class FinanceNomenclaturesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $nomenclatureList = [
            [
                'code' => '00000006539',
                'name' => 'Покупка дисциплин (оплата за обучение), за 1 кредит'
            ],
            [
                'code' => '00000006384',
                'name' => 'Вступительный взнос'
            ],
            [
                'code' => 'БК000000506',
                'name' => 'Доступ к обучению по дистанционной технологии (для студентов очного отделения), за 1 кредит'
            ],
            [
                'code' => '00000006364',
                'name' => 'Консультации по написанию Курсовой работы (стоимость 1 часа сверх утвержденных норм времени) для магистрантов'
            ],
            [
                'code' => '00000006362',
                'name' => 'Консультации по написанию Курсовой работы (стоимость 1 часа сверх утвержденных норм времени) для студентов бакалавриата'
            ],
            [
                'code' => '00000006353',
                'name' => 'Консультации по подготовке к Государственным экзаменам и написанию  дипломной работы/магистерской диссертации (стоимость 1 часа сверх утвержденных норм времени)'
            ],
            [
                'code' => '00000005735',
                'name' => 'Консультации по подготовке к творческому экзамену'
            ],
            [
                'code' => '00000004145',
                'name' => 'Консультации по профессиональной практике (стоимость 1 часа сверх утвержденных норм времени) для студентов бакалавриата'
            ],
            [
                'code' => '00000006350',
                'name' => 'Консультации по профессиональной практике (стоимость 1 часа сверх утвержденных норм времени) для магистрантов'
            ],
            [
                'code' => '00000007072',
                'name' => 'Консультация по сдаче вступительного экзамена'
            ],
            [
                'code' => '00000007839',
                'name' => 'Курсы дополнительных квалификаций'
            ],
            [
                'code' => '00000003279',
                'name' => 'Восстановление зачетной книжки'
            ],
            [
                'code' => '00000003278',
                'name' => 'Восстановление студенческого билета'
            ],
            [
                'code' => '00000002951',
                'name' => 'Оплата за восстановление'
            ],
            [
                'code' => '00000006356',
                'name' => 'Оплата за восстановление после отчисления за нарушение правил Кодекса'
            ],
            [
                'code' => '00000003274',
                'name' => 'Получение справки по месту требования'
            ],
            [
                'code' => '00000003276',
                'name' => 'Организационный сбор выпускника'
            ],
            [
                'code' => '00000003515',
                'name' => 'Отработка занятий, пропущенных без уважительной причины (1 рейтинговый балл)'
            ],
            [
                'code' => '00000007134',
                'name' => 'Повторная проверка Дипломной работы (проекта), Магистерской диссертации на плагиат'
            ],
            [
                'code' => '00000003516',
                'name' => 'Пробное тестирование'
            ],
            [
                'code' => '00000005825',
                'name' => 'Стоимость 1 кредита (ликвидация разницы, академической задолженности, учебный семестр, для студентов бакалавриата)'
            ],
            [
                'code' => '00000006339',
                'name' => 'Стоимость 1 кредита (ликвидация разницы, пререквизитов, академической задолженности, учебный семестр, для магистрантов)'
            ],
            [
                'code' => '00000007034',
                'name' => 'Доступ к посещению занятий, для студентов иностранных ВУЗов-партнеров (за 1 дисциплину)'
            ],
            [
                'code' => '00000007845',
                'name' => 'Оформление документов обучающихся-нерезидентов РК'
            ],
            [
                'code' => '00000007033',
                'name' => 'Оформление пакета документов при поступлении, для студентов иностранных ВУЗов'
            ],
            [
                'code' => '00000007072',
                'name' => 'Консультация по сдаче вступительного экзамена'
            ],
        ];

        foreach ($nomenclatureList as $nomenclature)
        {
            $nomModel = \App\FinanceNomenclature::where('code', $nomenclature['code'])->first();

            if(!$nomModel)
            {
                $nomModel = new \App\FinanceNomenclature();
            }

            $nomModel->fill($nomenclature);
            $nomModel->type='fee';
            $nomModel->save();
        }

    }
}