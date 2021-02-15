<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSectorIdFieldToDisciplinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('disciplines', function (Blueprint $table) {
            $table->integer('sector_id')->after('ex_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('disciplines', function (Blueprint $table) {
            $table->dropColumn('sector_id');
        });
    }
}