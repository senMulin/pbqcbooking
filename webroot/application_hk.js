var form_action_path = "/booking/api_hk";
var step_2_retryLimit = 5;
var step_2_retry_Timeout = 5000;
var check_result_Timeout = 2000;
var booking_array = {};
var CBSP_ID = [];
var avalible_departure_from = null;
var booking_period_url = "/booking/available_booking_period_pbqc";

function reload_avaliable_booking_period()
{
	var CDF_ID = $("#step_2_departure_from").find(":checked").attr("cdf-id");
	$(".booking_dates").html('<div class="text-center"><i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i><span class="sr-only">Loading...</span></div>');
	$(".accommodation_end_date").val("");
	$.ajax({
        type: "GET",
        async: false,
        url: booking_period_url,
        data: {departure_from: CDF_ID },
        success: function(d) {
            //check week
            var d = JSON.parse(d);
            booking_array = {};
            avalible_departure_from = d.avalible_departure_from;
            $.each(d.avalible_bookings, function(index, data){
            	if(data.avalible_booking_period.length > 0)
            	{
	            	//show the date
					$(".booking_dates").html("");
					//$("#step_2_CBSP_ID").val(data.CBSP_ID);
					//$("#step_2_CBSP_LOCATION").val(data.destination);
					CBSP_ID.push(data.CBSP_ID);

					$(".booking_dates").empty();
					$.each(data.avalible_booking_period, function(index, booking_period){
						item_display_str = moment(booking_period.CBP_START_DATE, 'YYYY-MM-DD HH:mm').format('YYYY/MM/DD (dddd)');

						if(booking_period.CBP_START_DATE != booking_period.CBP_END_DATE)
						{
							item_display_str += " - " +  moment(booking_period.CBP_END_DATE, 'YYYY-MM-DD HH:mm').format('YYYY/MM/DD (dddd)');
						}
						var disable_str = "";
						if(booking_period.value == 0)
						{
							disable_str = "disabled";
						}
						else
						{
							$("#step_1_booking_form input[type=Submit]").parent("div").removeClass('disable');
						}
						var aria_label_prefix = $('label[for=step_2_CBP_ID]').text();

						if(!booking_array.hasOwnProperty(booking_period.CBP_CCP_ID))
						{
							booking_array[booking_period.CBP_CCP_ID] = {CBSP_ID: booking_period.CBSP_ID, CBSP_LOCATION: booking_period.CBSP_LOCATION, CBP_CCP_ID: booking_period.CBP_CCP_ID, CCP_ENG_NAME: booking_period.CCP_ENG_NAME, CCP_CHI_NAME: booking_period.CCP_CHI_NAME, CCP_SCHI_NAME: booking_period.CCP_SCHI_NAME};
							booking_array[booking_period.CBP_CCP_ID]["booking_periods"] = [];
						}

						var aria_label = "";
						if(lang == "en")
						{
							aria_label = "Available for booking for entry on ";
						}
						if(lang == "tc")
						{
							aria_label = "可供預約入境的日期 ";
						}
						if(lang == "sc")
						{
							aria_label = "可供预约入境的日期";
						}

						var booking_radio = '<div class="radio_group booking_period booking_period_'+booking_period.CBP_CCP_ID+'" style=""><input type="radio" style="min-height: initial;" data-CBP_START_DATE="'+booking_period.CBP_START_DATE+'" data-CBP_END_DATE="'+booking_period.CBP_END_DATE+'" id="booking_period_'+ booking_period.CBP_ID +'" aria-pressed="true" aria-lable="'+ aria_label_prefix + " " + item_display_str +'" name="step_2_CBP_ID" value="'+ booking_period.CBP_ID + '" ' + disable_str + ' /> <label for="booking_period_'+ booking_period.CBP_ID +'" class="timeslots_label_'+ disable_str +'"><span class="invisible_label">'+ aria_label + '</span>'+ item_display_str+'</label></div>';

						if($("input[name=step_2_entrance_port]:checked").val() == booking_period.CBP_CCP_ID)
						{
							$(".booking_dates").append(booking_radio);
						}
					});
            	}

            	$('.booking_period').removeClass("booking_period_show");
				$('.booking_period_' + $('input[name=step_2_entrance_port]:checked').val()).addClass("booking_period_show");
            });

			$("input[name*=step_2_CBP_ID]").click(function(){
				$(".accommodation_end_date").val(moment($("input[name*=step_2_CBP_ID]:checked").attr("data-cbp_start_date"), "YYYY-MM-DD").add(parseInt($("#step_2_departure_from").find(":checked").attr("cdf-qd")), 'day').format('YYYY/MM/DD (dddd)'));
			});
        }
    });
}

function load_booking_period()
{
	$(".accommodation_end_date").val("");
	$.ajax({
        type: "GET",
        async: false,
        url: booking_period_url,
        data: {},
        success: function(d) {
            //check week
            var d = JSON.parse(d);
            booking_array = {};
            avalible_departure_from = d.avalible_departure_from;
            $.each(d.avalible_bookings, function(index, data){
            	if(data.avalible_booking_period.length > 0)
            	{
	            	//show the date
					$(".booking_dates").html("");
					//$("#step_2_CBSP_ID").val(data.CBSP_ID);
					//$("#step_2_CBSP_LOCATION").val(data.destination);
					CBSP_ID.push(data.CBSP_ID);

					$(".booking_dates").empty();
					$('.step_2_entrance_port_radio_group').empty();
					$.each(data.avalible_booking_period, function(index, booking_period){
						item_display_str = moment(booking_period.CBP_START_DATE, 'YYYY-MM-DD HH:mm').format('YYYY/MM/DD (dddd)');

						if(booking_period.CBP_START_DATE != booking_period.CBP_END_DATE)
						{
							item_display_str += " - " +  moment(booking_period.CBP_END_DATE, 'YYYY-MM-DD HH:mm').format('YYYY/MM/DD (dddd)');
						}
						var disable_str = "";
						if(booking_period.value == 0)
						{
							disable_str = "disabled";
						}
						else
						{
							$("#step_1_booking_form input[type=Submit]").parent("div").removeClass('disable');
						}
						var aria_label_prefix = $('label[for=step_2_CBP_ID]').text();

						if(!booking_array.hasOwnProperty(booking_period.CBP_CCP_ID))
						{
							booking_array[booking_period.CBP_CCP_ID] = {CBSP_ID: booking_period.CBSP_ID, CBSP_LOCATION: booking_period.CBSP_LOCATION, CBP_CCP_ID: booking_period.CBP_CCP_ID, CCP_ENG_NAME: booking_period.CCP_ENG_NAME, CCP_CHI_NAME: booking_period.CCP_CHI_NAME, CCP_SCHI_NAME: booking_period.CCP_SCHI_NAME};
							booking_array[booking_period.CBP_CCP_ID]["booking_periods"] = [];
						}

						var aria_label = "";
						if(lang == "en")
						{
							aria_label = "Available for booking for entry on ";
						}
						if(lang == "tc")
						{
							aria_label = "可供預約入境的日期 ";
						}
						if(lang == "sc")
						{
							aria_label = "可供预约入境的日期";
						}

						booking_array[booking_period.CBP_CCP_ID]["booking_periods"].push('<div class="radio_group booking_period booking_period_'+booking_period.CBP_CCP_ID+'" style=""><input type="radio" style="min-height: initial;" data-CBP_START_DATE="'+booking_period.CBP_START_DATE+'" data-CBP_END_DATE="'+booking_period.CBP_END_DATE+'" id="booking_period_'+ booking_period.CBP_ID +'" aria-pressed="true" aria-lable="'+ aria_label_prefix + " " + item_display_str +'" name="step_2_CBP_ID" value="'+ booking_period.CBP_ID + '" ' + disable_str + ' /> <label for="booking_period_'+ booking_period.CBP_ID +'" class="timeslots_label_'+ disable_str +'">'+ item_display_str+'</label><label for="booking_period_'+ booking_period.CBP_ID +'" class="invisible_label">'+aria_label + item_display_str + '</label></div>');

					});
            	}
            });

			$.each(booking_array, function(key, obj)
			{
				var aria_label = "";
				var entrance_label = "";
				if(lang == "en")
				{
					entrance_label = obj.CCP_ENG_NAME;
					aria_label = "Please select the quarantine accommodation, " + entrance_label;
				}
				if(lang == "tc")
				{
					entrance_label = obj.CCP_CHI_NAME;
					aria_label = "請選擇檢疫住宿, " + entrance_label;
				}
				if(lang == "sc")
				{
					entrance_label = obj.CCP_SCHI_NAME;
					aria_label = "请选择检疫住宿, " + entrance_label;
				}

				var entrance_port_radio_html = '<div class="radio_group"><input type="radio" id="step_2_entrance_port_'+obj.CBP_CCP_ID+'" ccp_ID="'+obj.CBP_CCP_ID+'" ccp_CBSP_ID="' + obj.CBSP_ID + '" ccp_CBSP_LOCATION="'+obj.CBSP_LOCATION+'" ccp_eng_name="' + obj.CCP_ENG_NAME + '" ccp_tc_name="' + obj.CCP_CHI_NAME + '" ccp_sc_name="' + obj.CCP_SCHI_NAME + '" name="step_2_entrance_port" value="'+obj.CBP_CCP_ID+'" style="min-height: initial;"><label for="step_2_entrance_port_'+obj.CBP_CCP_ID+'" >'+entrance_label+'</label><label for="step_2_entrance_port_'+obj.CBP_CCP_ID+'" class="invisible_label">'+aria_label+'</label></div>';

				$('.step_2_entrance_port_radio_group').append(entrance_port_radio_html);

			});

			$("input[name*=step_2_CBP_ID]").click(function(){
				$(".accommodation_end_date").val(moment($("input[name*=step_2_CBP_ID]:checked").attr("data-cbp_start_date"), "YYYY-MM-DD").add(parseInt($("#step_2_departure_from").find(":checked").attr("cdf-qd")), 'day').format('YYYY/MM/DD (dddd)'));
			});

			$('.step_2_entrance_port_radio_group input:first').attr('checked', 'checked');

			if($('.step_2_entrance_port_radio_group input:first').val() == 1 && $('.step_2_entrance_port_radio_group input').length == 1)
			{
				$('.step_2_entrance_port').hide();
			}

			$('input[name=step_2_entrance_port]').change(function(){
				$("input[name=step_2_CBP_ID]").prop('checked', false);
				$('.booking_period').empty();

				$("#step_2_departure_from option:not(:disabled)").remove();

				ccp_id = $('input[name=step_2_entrance_port]:checked').attr("ccp_ID");

				$.each(avalible_departure_from, function(index, df){

					if(df.CDF_CCP_ID == ccp_id)
					{
						display_label = "";
						if(lang == "en")
						{
							display_label = df.CDF_ENG_NAME;
						}
						if(lang == "tc")
						{
							display_label = df.CDF_CHI_NAME;
						}
						if(lang == "sc")
						{
							display_label = df.CDF_SCHI_NAME;
						}

						$("#step_2_departure_from").append('<option cdf-id="' + df.CDF_ID + '" cdf-qd="' + (parseInt(df.CDF_QUARANTINE_DURATION) - parseInt(df.CDF_QUARANTINE_DURATION_CLEANING_DAY_COUNT)) + '" value="'+df.CDF_ENG_NAME+'" alt="'+display_label+'" title="'+display_label+'">'+display_label+'</option>');
					}
				});

				if($("#step_2_departure_from option:not(:disabled)").length == 0)
				{
					$('.step_2_departure_from').hide();
					$("#step_2_departure_from").prop('required', false);
				}
				else
				{
					$('.step_2_departure_from').show();
					$("#step_2_departure_from").prop('required', true);
				}

				$("#step_2_departure_from").val("");

				$("#step_2_departure_from").change(function() {
					reload_avaliable_booking_period();
				});
			});

			$('input[name=step_2_entrance_port]').change();
        }

    });
}
$("#initial").ready(function() {
	moment.locale($("html").attr('lang'));
	$("#step_1_booking_form input[type=Submit]").parent("div").addClass('disable');
	$("form").attr("autocomplete", "on");
	$('input[placeholder!=""]').each(function(){
		var ph = $(this).attr("placeholder");
		if (ph !== undefined)
		{
			$(this).attr("placeholder", ph.replace(":","").replace("：",""))
		}
	});
	load_booking_period();

	$("#step_1_ATGC_NATCARDTYPE option").each(function(){
		if($(this).val()!=""){
			$(this).html(get_ATGC_NATCARDTYPE($(this).val()));
		}
	});

	$("#step_1_ATGC_NATCARDTYPE").change(function(){
		$('.step_1_documentId_detail input:not([readonly])').prop("required", false);
		$('.step_1_documentId_detail input:not([readonly])').val("");
		$('.step_1_documentId_detail > span').addClass("hide");
		if($(this).val() == "HK_IDCARD" || $(this).val() == "Hong Kong Identity Card" || $(this).val() == "CCIC" || $(this).val() == "ROP140"){
			$(".step_1_documentId_detail > .hk_id_input").removeClass("hide");
			$(".step_1_documentId_detail > .hk_id_input input:not([readonly])").prop("required", true);
		}

		else if($(this).val() == "EC"){
			$(".step_1_documentId_detail > .ec_input").removeClass("hide");
			$(".step_1_documentId_detail > .ec_input input:not([readonly])").prop("required", true);
		}
		else
		{
			$(".step_1_documentId_detail > .other_id_input").removeClass("hide");
			$(".step_1_documentId_detail > .other_id_input input:not([readonly])").prop("required", true);

			//$(".step_1_documentId_detail > .other_id_input input:not([readonly])").attr("pattern", $('#step_1_ATGC_NATCARDTYPE').find(":selected").attr("data-pattern"));
			//$(".step_1_documentId_detail > .other_id_input input:not([readonly])").attr("maxlength", $('#step_1_ATGC_NATCARDTYPE').find(":selected").attr("data-max-length"));
		}

		$('#step_2_departure_from').find("option[value=\""+$('#step_1_ATGC_NATCARDTYPE').find(":selected").attr("data-depart-from")+"\"]").prop("selected", true).change();


	});

	$("form").attr("action", form_action_path);

	setTimeout(function(){ if($(".step_loading").is(":visible")){$(".step_loading").slideUp(); $(".step_1").slideDown();}}, 500);

    $('#step_2_tel_for_sms_notif_confirm').bind('cut copy paste', function(e) {
		e.preventDefault();
	});

    $(".go_cancel").click(function(e){
    	e.preventDefault();
		show_target($(".step_cancel_booking"));
    });

    $(".goto_step_2").click(function(e){
    	e.preventDefault();
		show_target($(".note_2"));
    });

    $("#note_2_confirm").click(function() {
        if ($("#pics_consent").is(':checked') == false) {
            $("#pics_consent").focus();
            $("#pics_consent_validate_msg").html(eval("pics_err_" + lang));
            return;
        }
		if ($("#nr_consent").is(':checked') == false) {
            $("#nr_consent").focus();
            $("#nr_consent_validate_msg").html(eval("pics_err_" + lang));
            return;
        }
		if ($("#gr_consent").is(':checked') == false) {
            $("#gr_consent").focus();
            $("#gr_consent_validate_msg").html(eval("pics_err_" + lang));
            return;
        }
        setTimeout(handleTimeout, 1800000);
        setTimeout(handleReminderTimeout, 1620000);
		show_target($(".step_2"));
    });

    $("#pics_consent").change(function() {
        if ($("#pics_consent").is(':checked') == true) {
            $("#pics_consent").prop('checked', true);
        } else {
            $("#pics_consent").prop('checked', false);
        }
    });

    $("#step_2_date_of_birth_year").change(function() {
        $(".optDesc").css("display", "none");
    });
    switch (lang) {
        case "en":
            // for year
            $('#step_2_date_of_birth_year').append('<option disabled selected hidden value="">Year</option>');
            $('.step_2_child_date_of_birth_year').append('<option disabled selected hidden value="">Year</option>');
            var n = new Date().getFullYear();
            for (var i = 0; i < 200; i++) {
                var yy = (n - i);
                $('#step_2_date_of_birth_year').append('<option value="' + yy + '">' + yy + '</option>');
                $('.step_2_child_date_of_birth_year').append('<option value="' + yy + '">' + yy + '</option>');
            }

            // for month
            $('#step_2_date_of_birth_month').append('<option disabled selected hidden value="">Month</option>');
            $('.step_2_child_date_of_birth_month').append('<option disabled selected hidden value="">Month</option>');
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            for (var i = 0; i < monthNames.length; i++) {
                if (i < 9) {
                    $('#step_2_date_of_birth_month').append('<option value="0' + (i + 1) + '">' + monthNames[i] + '</option>');
                    $('.step_2_child_date_of_birth_month').append('<option value="0' + (i + 1) + '">' + monthNames[i] + '</option>');
                } else {
                    $('#step_2_date_of_birth_month').append('<option value="' + (i + 1) + '">' + monthNames[i] + '</option>');
                    $('.step_2_child_date_of_birth_month').append('<option value="' + (i + 1) + '">' + monthNames[i] + '</option>');
                }
            }
            $('#step_2_date_of_birth_month').append('<option value="-" class="na">Not applicable</option>');
            $('.step_2_child_date_of_birth_month').append('<option value="-" class="na">Not applicable</option>');

            // for day
            $('#step_2_date_of_birth_day').append('<option disabled selected hidden value="">Day</option>');
            $('.step_2_child_date_of_birth_day').append('<option disabled selected hidden value="">Day</option>');
            for (var i = 1; i <= 31; i++) {
                var dd = i;
                if (dd < 10) {
                    $('#step_2_date_of_birth_day').append('<option value="0' + dd + '">' + dd + '</option>');
                    $('.step_2_child_date_of_birth_day').append('<option value="0' + dd + '">' + dd + '</option>');
                } else {
                    $('#step_2_date_of_birth_day').append('<option value="' + dd + '">' + dd + '</option>');
                    $('.step_2_child_date_of_birth_day').append('<option value="' + dd + '">' + dd + '</option>');
                }
            }
            $('#step_2_date_of_birth_day').append('<option value="-" class="na">Not applicable</option>');
            $('.step_2_child_date_of_birth_day').append('<option value="-" class="na">Not applicable</option>');

            break;
        case "tc":
            // for year
            $('#step_2_date_of_birth_year').append('<option disabled selected hidden value="">年</option>');
            $('.step_2_child_date_of_birth_year').append('<option disabled selected hidden value="">年</option>');
            var n = new Date().getFullYear();
            for (var i = 0; i < 200; i++) {
                var yy = (n - i);
                $('#step_2_date_of_birth_year').append('<option value="' + yy + '">' + yy + '年</option>');
                $('.step_2_child_date_of_birth_year').append('<option value="' + yy + '">' + yy + '年</option>');
            }
            // for month
            $('#step_2_date_of_birth_month').append('<option disabled selected hidden value="">月</option>');
            $('.step_2_child_date_of_birth_month').append('<option disabled selected hidden value="">月</option>');
            for (var i = 1; i <= 12; i++) {
                var mm = i;
                if (mm < 10) {
                    $('#step_2_date_of_birth_month').append('<option value="0' + mm + '">' + mm + '月</option>');
                    $('.step_2_child_date_of_birth_month').append('<option value="0' + mm + '">' + mm + '月</option>');
                } else {
                    $('#step_2_date_of_birth_month').append('<option value="' + mm + '">' + mm + '月</option>');
                    $('.step_2_child_date_of_birth_month').append('<option value="' + mm + '">' + mm + '月</option>');
                }
            }
            $('#step_2_date_of_birth_month').append('<option value="-" class="na">不適用</option>');
            $('.step_2_child_date_of_birth_month').append('<option value="-" class="na">不適用</option>');

            // for day
            $('#step_2_date_of_birth_day').append('<option disabled selected hidden value="">日</option>');
            $('.step_2_child_date_of_birth_day').append('<option disabled selected hidden value="">日</option>');
            for (var i = 1; i <= 31; i++) {
                var dd = i;
                if (dd < 10) {
                    $('#step_2_date_of_birth_day').append('<option value="0' + dd + '">' + dd + '日</option>');
                    $('.step_2_child_date_of_birth_day').append('<option value="0' + dd + '">' + dd + '日</option>');
                } else {
                    $('#step_2_date_of_birth_day').append('<option value="' + dd + '">' + dd + '日</option>');
                    $('.step_2_child_date_of_birth_day').append('<option value="' + dd + '">' + dd + '日</option>');
                }
            }
            $('#step_2_date_of_birth_day').append('<option value="-" class="na">不適用</option>');
            $('.step_2_child_date_of_birth_day').append('<option value="-" class="na">不適用</option>');

            break;
        case "sc":
            // for year
            $('#step_2_date_of_birth_year').append('<option disabled selected hidden value="">年</option>');
            $('.step_2_child_date_of_birth_year').append('<option disabled selected hidden value="">年</option>');
            var n = new Date().getFullYear();
            for (var i = 0; i < 200; i++) {
                var yy = (n - i);
                $('#step_2_date_of_birth_year').append('<option value="' + yy + '">' + yy + '年</option>');
                $('.step_2_child_date_of_birth_year').append('<option value="' + yy + '">' + yy + '年</option>');
            }
            // for month
            $('#step_2_date_of_birth_month').append('<option disabled selected hidden value="">月</option>');
            $('.step_2_child_date_of_birth_month').append('<option disabled selected hidden value="">月</option>');
            for (var i = 1; i <= 12; i++) {
                var mm = i;
                if (mm < 10) {
                    $('#step_2_date_of_birth_month').append('<option value="0' + mm + '">' + mm + '月</option>');
                    $('.step_2_child_date_of_birth_month').append('<option value="0' + mm + '">' + mm + '月</option>');
                } else {
                    $('#step_2_date_of_birth_month').append('<option value="' + mm + '">' + mm + '月</option>');
                    $('.step_2_child_date_of_birth_month').append('<option value="' + mm + '">' + mm + '月</option>');
                }
            }
            $('#step_2_date_of_birth_month').append('<option value="-" class="na">不适用</option>');
            $('.step_2_child_date_of_birth_month').append('<option value="-" class="na">不适用</option>');

            // for day
            $('#step_2_date_of_birth_day').append('<option disabled selected hidden value="">日</option>');
            $('.step_2_child_date_of_birth_day').append('<option disabled selected hidden value="">日</option>');
            for (var i = 1; i <= 31; i++) {
                var dd = i;
                if (dd < 10) {
                    $('#step_2_date_of_birth_day').append('<option value="0' + dd + '">' + dd + '日</option>');
                    $('.step_2_child_date_of_birth_day').append('<option value="0' + dd + '">' + dd + '日</option>');
                } else {
                    $('#step_2_date_of_birth_day').append('<option value="' + dd + '">' + dd + '日</option>');
                    $('.step_2_child_date_of_birth_day').append('<option value="' + dd + '">' + dd + '日</option>');
                }
            }
            $('#step_2_date_of_birth_day').append('<option value="-" class="na">不适用</option>');
            $('.step_2_child_date_of_birth_day').append('<option value="-" class="na">不适用</option>');
            break;
        default:
    }
    $("#step_2_date_of_birth_month").change(function() {
        var naOpt = $("#step_2_date_of_birth_month option:selected").val();
        if (naOpt == "-") {
            $("#step_2_date_of_birth_day option").attr('disabled', 'disabled');
            $('#step_2_date_of_birth_day option[value="-"]').removeAttr("disabled").prop("selected", true);
        } else {
            $("#step_2_date_of_birth_day option").removeAttr("disabled");
        }
    });

    $("#step_2_select_child_num").change(function() {
        var selectedVal = $(this).find("option:selected").val();
        var intVal = parseInt(selectedVal);
        $("#child_list").html("");
        for (var i = 1; i <= intVal; i++) {
            var child_div = $(".child_template").clone(true).css("display", "block").attr("class", "child_form");

            $(child_div).find("span[name=childnum]").html(i);
            $(child_div).find("input[name=step_2_child_chi_givename]").attr("name", "step_2_child_chi_givename_" + i);
            $(child_div).find("input[name=step_2_child_chi_surname]").attr("name", "step_2_child_chi_surname_" + i);
            $(child_div).find("input[name=step_2_child_eng_givename]").attr("name", "step_2_child_eng_givename_" + i);
            $(child_div).find("input[name=step_2_child_eng_surname]").attr("name", "step_2_child_eng_surname_" + i);
            $(child_div).find("select[name=step_2_child_date_of_birth_year]").attr('required', 'required').attr("name", "step_2_child_date_of_birth_year_" + i).attr("class", "step_2_child_date_of_birth_year_" + i);
            $(child_div).find("select[name=step_2_child_date_of_birth_month]").attr('required', 'required').attr("name", "step_2_child_date_of_birth_month_" + i).attr("class", "step_2_child_date_of_birth_month_" + i);
            $(child_div).find("select[name=step_2_child_date_of_birth_day]").attr('required', 'required').attr("name", "step_2_child_date_of_birth_day_" + i).attr("class", "step_2_child_date_of_birth_day_" + i);
            $(child_div).find("select[name=step_2_child_name_gender]").attr('required', 'required').attr("name", "step_2_child_name_gender_" + i);
            $(child_div).find('label[for="step_2_child_nationality_china"]').attr("for", "step_2_child_nationality_china_" + i);
            $(child_div).find('label[for="step_2_child_nationality_other"]').attr("for", "step_2_child_nationality_other_" + i);
            $(child_div).find("input[id=step_2_child_nationality_china]").attr("id", "step_2_child_nationality_china_" + i);
            $(child_div).find("input[id=step_2_child_nationality_other]").attr("id", "step_2_child_nationality_other_" + i);
            $(child_div).find("input[name=step_2_child_nationality_opt]").attr("name", "step_2_child_nationality_opt_" + i);
            $(child_div).find("input[name=step_2_child_nationality]").attr('required', 'required').attr("name", "step_2_child_nationality_" + i);
            $(child_div).find("input[name=step_2_child_documentId_HKIC_prefix]").attr('required', 'required').attr("name", "step_2_child_documentId_HKIC_prefix_" + i);
            $(child_div).find("input[name=step_2_child_documentId_HKIC_check_digit]").attr('required', 'required').attr("name", "step_2_child_documentId_HKIC_check_digit_" + i);
            $(child_div).find("input[name=step_2_child_document_ID]").attr('required', 'required').attr("name", "step_2_child_document_ID_" + i);
            $(child_div).find("div.step_2_child_document_ID_validate_msg").attr("name", "step_2_child_document_ID_validate_msg_" + i);
            $(child_div).find("div.step_2_child_duplicate_validate_msg").attr("name", "step_2_child_duplicate_validate_msg_" + i);

            $(child_div).find("select[name=step_2_child_document_type]").attr('required', 'required').attr("name", "step_2_child_document_type_" + i);
            //$(child_div).find("select[name=step_2_child_document_type_radio]").attr("name", "step_2_child_document_type_radio_" + i);
            $(child_div).find('label[for="step_2_child_other_document_ID_radio"]').attr("for", "step_2_child_other_document_ID_radio_" + i);
            $(child_div).find("input[id=step_2_child_other_document_ID_radio]").attr("id", "step_2_child_other_document_ID_radio_" + i);
            $(child_div).find('label[for="step_2_child_HKID_document_ID_radio"]').attr("for", "step_2_child_HKID_document_ID_radio_" + i);
            $(child_div).find("input[id=step_2_child_HKID_document_ID_radio]").attr("id", "step_2_child_HKID_document_ID_radio_" + i);
            $(child_div).find("select[id=step_2_child_mainland_travel_document_type]").attr("id", "step_2_child_mainland_travel_document_type_" + i);
            $(child_div).find("input[name=step_2_child_other_document_ID]").attr('required', 'required').attr("name", "step_2_child_other_document_ID_" + i);
            $(child_div).find("div.step_2_child_other_document_ID_validate_msg").attr("name", "step_2_child_other_document_ID_validate_msg_" + i);

            $(child_div).find("select[name=step_2_child_mainland_travel_document_type]").attr('required', 'required').attr("name", "step_2_child_mainland_travel_document_type_" + i);
            $(child_div).find("input[name=step_2_child_mainland_travel_document_no]").attr('required', 'required').attr("name", "step_2_child_mainland_travel_document_no_" + i);

            $("#child_list").append(child_div);
        }

        $("select[name=step_2_child_document_type_1] option").each(function(){
    		if($(this).val()!=""){
    			$(this).html(get_ATGC_NATCARDTYPE($(this).val()));
    		}
    	});

        $("select[name=step_2_child_document_type_2] option").each(function(){
    		if($(this).val()!=""){
    			$(this).html(get_ATGC_NATCARDTYPE($(this).val()));
    		}
    	});

        $("select[name=step_2_child_document_type_3] option").each(function(){
    		if($(this).val()!=""){
    			$(this).html(get_ATGC_NATCARDTYPE($(this).val()));
    		}
    	});

        $("input[name=step_2_child_document_type_radio" + "_1" + "]").change(function(){
        	if($("input[name=step_2_child_document_type_radio" + "_1" + "]:checked").val() == "HK_document_ID")
        	{
        		$("input[name=step_2_child_documentId_HKIC_prefix" + "_1" + "]").prop("required", true).prop("disabled", false);
        		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_1" + "]").prop("required", true).prop("disabled", false);
        		$("input[name=step_2_child_other_document_ID" + "_1" + "]").prop("required", false).prop("disabled", true);
        	}

        	if($("input[name=step_2_child_document_type_radio" + "_1" + "]:checked").val() == "other_document_ID")
        	{
        		$("input[name=step_2_child_documentId_HKIC_prefix" + "_1" + "]").prop("required", false).prop("disabled", true);
        		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_1" + "]").prop("required", false).prop("disabled", true);
        		$("input[name=step_2_child_other_document_ID" + "_1" + "]").prop("required", true).prop("disabled", false);
        	}

        	$("input[name=step_2_child_documentId_HKIC_prefix" + "_1" + "]").val("");
    		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_1" + "]").val("");
    		$("input[name=step_2_child_other_document_ID" + "_1" + "]").val("");
        });

        $("input[name=step_2_child_document_type_radio" + "_2" + "]").change(function(){
        	if($("input[name=step_2_child_document_type_radio" + "_2" + "]:checked").val() == "HK_document_ID")
        	{
        		$("input[name=step_2_child_documentId_HKIC_prefix" + "_2" + "]").prop("required", true).prop("disabled", false);
        		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_2" + "]").prop("required", true).prop("disabled", false);
        		$("input[name=step_2_child_other_document_ID" + "_2" + "]").prop("required", false).prop("disabled", true);
        	}

        	if($("input[name=step_2_child_document_type_radio" + "_2" + "]:checked").val() == "other_document_ID")
        	{
        		$("input[name=step_2_child_documentId_HKIC_prefix" + "_2" + "]").prop("required", false).prop("disabled", true);
        		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_2" + "]").prop("required", false).prop("disabled", true);
        		$("input[name=step_2_child_other_document_ID" + "_2" + "]").prop("required", true).prop("disabled", false);
        	}

        	$("input[name=step_2_child_documentId_HKIC_prefix" + "_2" + "]").val("");
    		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_2" + "]").val("");
    		$("input[name=step_2_child_other_document_ID" + "_2" + "]").val("");
        });

        $("input[name=step_2_child_document_type_radio" + "_3" + "]").change(function(){
        	if($("input[name=step_2_child_document_type_radio" + "_3" + "]:checked").val() == "HK_document_ID")
        	{
        		$("input[name=step_2_child_documentId_HKIC_prefix" + "_3" + "]").prop("required", true).prop("disabled", false);
        		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_3" + "]").prop("required", true).prop("disabled", false);
        		$("input[name=step_2_child_other_document_ID" + "_3" + "]").prop("required", false).prop("disabled", true);
        	}

        	if($("input[name=step_2_child_document_type_radio" + "_3" + "]:checked").val() == "other_document_ID")
        	{
        		$("input[name=step_2_child_documentId_HKIC_prefix" + "_3" + "]").prop("required", false).prop("disabled", true);
        		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_3" + "]").prop("required", false).prop("disabled", true);
        		$("input[name=step_2_child_other_document_ID" + "_3" + "]").prop("required", true).prop("disabled", false);
        	}

        	$("input[name=step_2_child_documentId_HKIC_prefix" + "_3" + "]").val("");
    		$("input[name=step_2_child_documentId_HKIC_check_digit" + "_3" + "]").val("");
    		$("input[name=step_2_child_other_document_ID" + "_3" + "]").val("");
        });

        $(".step_2_child_date_of_birth_year_1").change(function(){
        	check_if_under_age_11("_1");
        });

        $(".step_2_child_date_of_birth_month_1").change(function() {
            var naOpt = $(".step_2_child_date_of_birth_month_1 option:selected").val();
            if (naOpt == "-") {
                $(".step_2_child_date_of_birth_day_1 option").attr('disabled', 'disabled');
                $('.step_2_child_date_of_birth_day_1 option[value="-"]').removeAttr("disabled").prop("selected", true);
            } else {
                $(".step_2_child_date_of_birth_day_1 option").removeAttr("disabled");
            }

            check_if_under_age_11("_1");
        });

        $(".step_2_child_date_of_birth_day_1").change(function(){
        	check_if_under_age_11("_1");
        });

        $(".step_2_child_date_of_birth_year_2").change(function(){
        	check_if_under_age_11("_2");
        });

        $(".step_2_child_date_of_birth_month_2").change(function() {
            var naOpt = $(".step_2_child_date_of_birth_month_2 option:selected").val();
            if (naOpt == "-") {
                $(".step_2_child_date_of_birth_day_2 option").attr('disabled', 'disabled');
                $('.step_2_child_date_of_birth_day_2 option[value="-"]').removeAttr("disabled").prop("selected", true);
            } else {
                $(".step_2_child_date_of_birth_day_2 option").removeAttr("disabled");
            }

            check_if_under_age_11("_2");
        });

        $(".step_2_child_date_of_birth_day_2").change(function(){
        	check_if_under_age_11("_2");
        });

        $(".step_2_child_date_of_birth_year_3").change(function(){
        	check_if_under_age_11("_3");
        });

        $(".step_2_child_date_of_birth_month_3").change(function() {
            var naOpt = $(".step_2_child_date_of_birth_month_3 option:selected").val();
            if (naOpt == "-") {
                $(".step_2_child_date_of_birth_day_3 option").attr('disabled', 'disabled');
                $('.step_2_child_date_of_birth_day_3 option[value="-"]').removeAttr("disabled").prop("selected", true);
            } else {
                $(".step_2_child_date_of_birth_day_3 option").removeAttr("disabled");
            }

            check_if_under_age_11("_3");
        });

        $(".step_2_child_date_of_birth_day_3").change(function(){
        	check_if_under_age_11("_3");
        });

        $(".child_form .nationality_group").addClass("childRadio");
        $("input[name*=step_2_child_nationality_opt_]").change( function() {
        	if($(this).val() == "Other") {
    			$(this).parents('.nationality_group').find('.text_input_nationality').prop("disabled", false).prop("required", true);
    		} else {
    			$(this).parents('.nationality_group').find('.text_input_nationality').prop("disabled", true).prop("required", true).val("");
    		}
        });


    });
});
$(function() {
	$(".cancel_reload_button").click(function(e){
		location.reload();
	});

	$(".cancel_booking_cancel_button").click(function(e){
		e.preventDefault();
		if($('.enq_form').length == 1)
		{
			show_target($("#booking_result"));
			return;
		}
		$('html, body').animate({
            scrollTop: $(".step_2").offset().top
        }, 500);

		$("#step_2_input_page input").not(':input[type=hidden], input[type=radio], :input[type=button], :input[type=submit], :input[type=reset]').each(function( index ){
			$(this).parent(".input-div").removeClass("input-div-no-border");
			$(this).show();
		});
		$(".review_input,.review_input_na").remove();

		$("#cancel_booking .display").addClass("dtl");
		$("#cancel_booking input").not(':input[type=hidden], :input[type=radio], :input[type=button], :input[type=submit], :input[type=reset]').each(function( index ){
			$(this).parent(".input-div").removeClass("input-div-no-border");
			$(this).show();
		});

		$("#cancel_booking_enquiry_captchaCode").html("");
 	   if (typeof cancel_booking_enquiry_captchaCode !== "undefined")
 	   {
 		   grecaptcha.enterprise.reset(cancel_booking_enquiry_captchaCode);
 	   }

		$("#cancel_booking  .input_review_control").show();
		$("#cancel_booking  .input_confirm_control").hide();
	});

    $(".step_2_cancel_button").click(function(e) {
        e.preventDefault();
        //show the confirmation page
        //show_confirm_page();
        //load_booking_period();
        $('#step_2_departure_from').change();
        $('html, body').animate({
            scrollTop: $(".step_2").offset().top
        }, 500);

        $(".review_input,.review_input_na").remove();
        $(".child_name_div").removeClass("div_review_input");
        $(".formAreaCode").removeClass("ddarea");

        $(".child_form .nationality_group").addClass("childRadio");
        $("#step_2_input_page input[name*='nationality_opt']:checked").each(function(index){
			$(this).parents(".radio_group_parent").show();
			if($(this).val() == "China")
			{
				$(this).parents('.nationality_group').find('.text_input_nationality').prop("disabled", true).prop("required", true).val("");
			}
        });

        $("#step_2_input_page input").not(':input[type=hidden], input[type=radio], :input[type=button], :input[type=submit], :input[type=reset]').each(function(index) {
            $(this).parent(".input-div").removeClass("input-div-no-border");
            $(this).show();
        });

        $("#step_2_input_page textarea").not('#g-recaptcha-response-1').each(function(index) {
            $(this).parent(".input-div").removeClass("input-div-no-border");
            $(this).show();
        });

        $("#step_2_input_page select").each(function(index) {
            $(this).show();
            $(this).parent(".input-div").removeClass("input-div-no-border");
        });

        $("#step_2_input_page input[type=radio]:checked").not("input[name=step_2_CBP_ID]").each(function(index){
			$(this).parents(".radio_group_parent").children().show();
		});

        $(".booking_period").removeAttr("style");
        $("input[name=step_2_CBP_ID]").prop('checked', false);

        $(".sms_flex").addClass("sms_align_center");
        $(".step2_form_label").show();
        $(".step2_form_review_label").hide();

        $(".step_2_child_document_type").each(function(){
        	$(this).parents(".mb-3").show();
        });

        //reset_SMS_verification();

        $(".input_review_control").show();
        $(".input_confirm_control").hide();
        return;
    });

    $("#step_1_documentId_HKIC").change(function() {
        $('#step_1_passcode').val("");
        $('#step_1_passcode_validate_msg').html("");
    });
    $("#step_1_documentId").change(function() {
        $("#step_1_validate_msg").html("");
    });

    $("#step_2_fullname_alt").change(function() {
        if ($(this).val() != "") {
            $("#step_2_fullname").removeAttr('required');
        }
    });

    $("#step_2_fullname").change(function() {
        if ($(this).val() != "") {
            $("#step_2_fullname_alt").removeAttr('required');
        }
    });

    $("input[name=step_2_nationality_opt]").change( function() {
		if($(this).val() == "Other") {
			$(this).parents('.nationality_group').find('.text_input_nationality').prop("disabled", false).prop("required", true);
		} else {
			$(this).parents('.nationality_group').find('.text_input_nationality').prop("disabled", true).prop("required", true).val("");
		}
    });

    $("#step_1_booking_form, #step_1_enq_form").submit(function(e) {
        e.preventDefault();

        $("#step_1_validate_msg").html("");

        if($("select[name='step_1_documentId_Type']").val() == "HK_IDCARD" ||
        		$("select[name='step_1_documentId_Type']").val() == "Hong Kong Identity Card" ||
				$("select[name='step_1_documentId_Type']").val() == "CCIC" ||
				$("select[name='step_1_documentId_Type']").val() == "ROP140" )
		{

			$("#step_1_documentId_HKIC").val($("#step_1_documentId_HKIC_prefix").val() + $("#step_1_documentId_HKIC_check_digit").val());

			if(!IsHKID($("#step_1_documentId_HKIC").val()))
			{
				if(lang == "en")
				{
					$("#step_1_validate_msg").html("Invalid Hong Kong Identity Card Number.");
				}
				if(lang == "tc")
				{
					$("#step_1_validate_msg").html("香港身份證號碼不正確。");
				}
				if(lang == "sc")
				{
					$("#step_1_validate_msg").html("香港身份证号码不正确。");
				}
				return;
			}
		}
		else if($("select[name='step_1_documentId_Type']").val() == "EC")
		{
			$("#step_1_documentId_HKIC").val($("#step_1_ec_documentId_ref_initial").val() +
					$("#step_1_ec_documentId_ref_first").val() +
					$("#step_1_ec_documentId_ref_second").val() +
					$("#step_1_ec_documentId_ref_digit").val());
		}
		else
		{
			var input_string = $("#step_1_other_documentId").val();
			if (!input_string.match(/^[^\x22\\\/]+$/))
			{
				if(lang == "en")
				{
					$("#step_1_validate_msg").html("Invalid identity card number.");
				}
				if(lang == "tc")
				{
					$("#step_1_validate_msg").html("身份證明文件號碼不正確。");
				}
				if(lang == "sc")
				{
					$("#step_1_validate_msg").html("身份证明文件号码不正确。");
				}
				return;
			}
			$("#step_1_documentId_HKIC").val(input_string);
		}

        var url = $(this).attr('action');
        var form_id = $(this).attr("id");
        $.ajax({
            type: "POST",
            async: false,
            url: a_dom + url,
            data: $(this).serialize(), // serializes the form's elements.
            success: function(data) {
                $("#step_1_captchaCode_validate_msg").html("");
                if (typeof step_1_captchaCode !== "undefined")
                {
                	grecaptcha.enterprise.reset(step_1_captchaCode);
                }
                var data = JSON.parse(data);

                if (data.result == "captcha invalid") {
                    $("#step_1_captchaCode_validate_msg").html("");
                    $("#step_1_captchaCode_validate_msg").html(eval("captcha_err_" + lang));
                } else if (data.is_booking_exist) {
                    //reg user
                	if(data.appl_status == "P" || data.appl_status == "S")
                	{
                        show_loading();
                	}
                	else if(data.is_ref_correct == false && $('.enq_form').length == 1)
                	{
                		$(".reg_enquiry").show();
						show_target($(".reg_failed"));
                	}
                	else if (typeof data.ATH_REF_NO !== "undefined" && data.appl_status == 'A')
                	{
                		$(".go_cancel").parent(".input-submit-div").show();
                		show_result_success(data);
                		show_cancel_detail(data);
                	}
                	else if(data.CBSP_ID)
                	{
                		setTimeout(handleTimeout, 1800000);

                		$(".goto_step_2").parent(".input-submit-div").hide();
                		if(data.is_parent == 0)
                		{
                			$(".child_cancel").show();
                			$(".parent_cancel").hide();
                		}

                		//$("#cancel_booking_documentId_display").val(data.documentId);
                		if( data.ATH_NATCARDTYPE == "Hong Kong Identity Card")
                		{
                			$("#cancel_booking_documentId_display").val(hkid_display(data.documentId));
                		}
                		else
                		{
                			$("#cancel_booking_documentId_display").val(data.documentId);
                		}

                		$("#cancel_booking_documentId").val(data.documentId);

                		$("#step_2_documentId_display").val(data.documentId);
                		$("#step_2_documentId").val(data.documentId);

						show_target($(".step_cancel_booking"));
                	}
                	else
                	{
                		//move to step_2
                		if($("select[name='step_1_documentId_Type']").val() == "HK_IDCARD" ||
                				$("select[name='step_1_documentId_Type']").val() == "Hong Kong Identity Card" ||
	            				$("select[name='step_1_documentId_Type']").val() == "CCIC" ||
	            				$("select[name='step_1_documentId_Type']").val() == "ROP140" )
            			{
            				$("#step_2_documentId_display").val(hkid_display(data.documentId));
            			}
            			else if($("select[name='step_1_documentId_Type']").val() == "EC")
            			{
            				$("#step_2_documentId_display").val(ec_display(data.documentId));
            			}
		            	else
		            	{
		            		$("#step_2_documentId_display").val(data.documentId);
		            	}
                		$("#step_2_document_Type_display").val(get_ATGC_NATCARDTYPE($("select[name='step_1_documentId_Type']").val()));
						$("#step_2_document_type").val($("select[name='step_1_documentId_Type']").val());
						$("#step_2_documentId").val(data.documentId);

    					show_target($(".note_2"));
                	}
                } else if (data.result.indexOf("fail") == -1 && form_id == "step_1_booking_form") {
                    //move to step_2
                	if($("select[name='step_1_documentId_Type']").val() == "HK_IDCARD" ||
                			$("select[name='step_1_documentId_Type']").val() == "Hong Kong Identity Card" ||
            				$("select[name='step_1_documentId_Type']").val() == "CCIC" ||
            				$("select[name='step_1_documentId_Type']").val() == "ROP140" )
        			{
        				$("#step_2_documentId_display").val(hkid_display(data.documentId));
        			}
        			else if($("select[name='step_1_documentId_Type']").val() == "EC")
        			{
        				$("#step_2_documentId_display").val(ec_display(data.documentId));
        			}
	            	else
	            	{
	            		$("#step_2_documentId_display").val(data.documentId);
	            	}
            		$("#step_2_document_type_display").val(get_ATGC_NATCARDTYPE($("select[name='step_1_documentId_Type']").val()));
					$("#step_2_document_type").val($("select[name='step_1_documentId_Type']").val());
                    $("#step_2_documentId").val(data.documentId);

					show_target($(".note_2"));
                } else {
                	$(".reg_enquiry").show();
					show_target($(".reg_failed"));
                }
            }
        });

    });

    $('#cancel_booking').submit(function(e) {
		e.preventDefault();

		if(!($("#cancel_booking .input_confirm_control").is(":visible")))
		{
			$('html, body').animate({
                scrollTop: $("#cancel_booking").offset().top
            }, 500);

			$("#cancel_booking_action").val("cancel_booking_enquiry");
			var url =  $(this).attr('action');

			$.ajax({
				   type: "POST",
				   url:	 a_dom + url,
				   data: $(this).serialize(),
				   success: function(data)
				   {
					   $("#cancel_booking_enquiry_captchaCode").html("");
		        	   if (typeof cancel_booking_enquiry_captchaCode !== "undefined")
		        	   {
		        		   grecaptcha.enterprise.reset(cancel_booking_enquiry_captchaCode);
		        	   }

					   var data = JSON.parse(data);

					   if(data.result == "captcha invalid")
					   {
						   $("#cancel_booking_enquiry_captchaCode_validate_msg").html("");
						   $("#cancel_booking_enquiry_captchaCode_validate_msg").html(eval("captcha_err_" + lang));
					   }
					   else if(data.result == "enquiry_success")
					   {
						   	item_display_str = moment(data.ATH_DEPART_DATE, 'YYYY-MM-DD').format('YYYY/MM/DD (dddd)');

							$("#cancel_booking .DEPART_DATE_PERIOD").val(item_display_str);
							$("#cancel_booking .CHILDREN_NUM").val(data.appl_CHILDREN.length);
							$("#cancel_booking .PURPOSE_OF_ENTRY").val(eval("purpose_of_entry_display_" + lang));

							$(".review_input,.review_input_na").html("");
							$("#cancel_booking input").not(':input[type=hidden], :input[type=radio], :input[type=button], :input[type=submit], :input[type=reset]').each(function( index ){
								$(this).hide();
								$(this).parent(".input-div").addClass("input-div-no-border");
								$(this).after('<span class="review_input input_span input_span_highlight">' + $(this).val() + '</span>');
							});

						   $("#cancel_booking .display").removeClass("dtl");
						   $("#cancel_booking .input_review_control").hide();
						   $("#cancel_booking  .input_confirm_control").show();
						   $('#cancel_booking_enquiry_captchaCode').empty();

						   if(data.ATH_LD_STATUS == "Confirmed")
							{
							   $("#cancel_booking input[type=submit]").parent(".input-submit-div").hide()
							}
					   }
					   else
					   {
						   $(".reg_enquiry").show();
							show_target($(".reg_failed"));
					   }
				   }
			});
			return;
		}

		$("#cancel_booking_action").val("cancel_booking");
		var url =  $(this).attr('action');

		var final_cancel_confirm_label = "";
		if(lang == "en")
		{
			final_cancel_confirm_label = "Warning:  You will not be able to reserve another room if all rooms available have been all reserved after your cancellation.  Do you wish to confirm your cancellation?";
		}
		if(lang == "tc")
		{
			final_cancel_confirm_label = "請注意，取消預約後，如果所有可提供的房間已經全部被預訂，你將會無法預約另一間房間。你是否確定要取消預約？";
		}
		if(lang == "sc")
		{
			final_cancel_confirm_label = "请注意，取消预约后，如果所有可提供的房间已经全部被预订，你将会无法预约另一间房间。你是否确定要取消预约？";
		}

		if (confirm(final_cancel_confirm_label)) {
		} else {
			// Do nothing!
			return;
		}

		$.ajax({
			   type: "POST",
			   url: a_dom + url,
			   data: $(this).serialize(),
			   success: function(data)
			   {
				   $("#cancel_booking_captchaCode").html("");
	        	   if (typeof cancel_booking_captchaCode !== "undefined")
	        	   {
	        		   grecaptcha.enterprise.reset(cancel_booking_captchaCode);
	        	   }

				   var data = JSON.parse(data);

				   if(data.result == "captcha invalid")
				   {
					   $("#cancel_booking_captchaCode_validate_msg").html("");
					   $("#cancel_booking_captchaCode_validate_msg").html(eval("captcha_err_" + lang));
				   }
				   else if(data.result == "cancel_success")
				   {
					   show_target($(".step_cancel_success"));
				   }
				   else
				   {
					   $(".reg_cancel").show();
						show_target($(".reg_failed"));
				   }
			   }
		});

	});

    $('#step_2_booking_form').submit(function(e) {
        e.preventDefault();

        $(".applicant_error_msg").hide();
        $("#step_2_fdh_name_validate_msg").hide();

        $("#step_2_input_page input[type=text]").each(function(){
			$(this).val($.trim($(this).val()));
		});

        $("#step_2_fullname_validate_msg").html("");
        if($("#step_2_chi_surname").val() == "" && $("#step_2_chi_givename").val() == "" && $("#step_2_eng_surname").val() == "" && $("#step_2_eng_givename").val() == "")
        {
        	if(lang == "en")
			{
				$("#step_2_fullname_validate_msg").html("Please fill in at least one name field.");
			}
			if(lang == "tc")
			{
				$("#step_2_fullname_validate_msg").html("請填寫最少一個名字。");
			}
			if(lang == "sc")
			{
				$("#step_2_fullname_validate_msg").html("请填写最少一个名字。");
			}
			$('html, body').animate({
                scrollTop: $("#step_2_fullname_validate_msg").offset().top-50
            }, 500);
            return;
        }


		$("#step_2_tel_for_sms_notif_confirm_validate_msg").html("");
		if($("#step_2_tel_for_sms_notif").val() != $("#step_2_tel_for_sms_notif_confirm").val())
		{
			if(lang == "en")
			{
				$("#step_2_tel_for_sms_notif_confirm_validate_msg").html("The re-entered contact phone number does not match.");
			}
			if(lang == "tc")
			{
				$("#step_2_tel_for_sms_notif_confirm_validate_msg").html("再次輸入的可接收香港SMS短訊通知的聯絡電話號碼不正確");
			}
			if(lang == "sc")
			{
				$("#step_2_tel_for_sms_notif_confirm_validate_msg").html("再次输入可接收香港SMS短讯通知的联络电话号码不正确");
			}
			$('html, body').animate({
                scrollTop: $("#step_2_tel_for_sms_notif_confirm_validate_msg").offset().top-50
            }, 500);
			return;
		}
		/*
        if ($("#step_2_fullname").val() == "" && $("#step_2_fullname_alt").val() == "") {
            $("#step_2_fullname").prop('required', true);
            setTimeout(function() {
                $("#step_2_form_control_confirm").click();
            }, 200);
            return;
        }
		*/
        //$("#step_2_tel_for_sms_verification_validate_msg").html("");
        /*

        if ($("#step_2_input_page #step_2_gender").val() == "") {
            $("#step_2_input_page #step_2_gender").prop('required', true);
            return;
        }

        if ($("#step_2_input_page #step_2_select_purpose_of_entry").val() == "") {
            $("#step_2_input_page #step_2_select_purpose_of_entry").prop('required', true);
            return;
        }
        */
        $("#step_2_avalible_booking_validate_msg").html("");
		if($("input[name='step_2_CBP_ID']:checked").length == 0)
		{
			if(lang == "en")
			{
				$("#step_2_avalible_booking_validate_msg").html("Please select a booking period.");
			}
			if(lang == "tc")
			{
				$("#step_2_avalible_booking_validate_msg").html("請選擇一個預約日期。");
			}
			if(lang == "sc")
			{
				$("#step_2_avalible_booking_validate_msg").html("請選擇一個预约日期。");
			}
			$('html, body').animate({
                scrollTop: $("#step_2_avalible_booking_validate_msg").offset().top-50
            }, 500);
			return;
		}

		/*
        $("#step_2_date_of_birth_validate_msg").html("");
        if (is_underAgeValidate($("#step_2_date_of_birth_year").val() + "/" + (($("#step_2_date_of_birth_month").val() == "-") ? "01" : $("#step_2_date_of_birth_month").val()) + "/" + (($("#step_2_date_of_birth_day").val() == "-") ? "01" : $("#step_2_date_of_birth_day").val()))) {
            if (lang == "en") {
                $("#step_2_date_of_birth_validate_msg").html("Register age should be age of 18 above.");
            }
            if (lang == "tc") {
                $("#step_2_date_of_birth_validate_msg").html("登記人必須年滿18歲以上。");
            }
            if (lang == "sc") {
                $("#step_2_date_of_birth_validate_msg").html("登记人必须年满18岁以上。");
            }
            $('html, body').animate({
                scrollTop: $("#step_2_date_of_birth_validate_msg").offset().top
            }, 500);
            return;
        }

        $("#step_2_date_of_birth_validate_msg").html("");
        if (!is_validateDate($("#step_2_date_of_birth_year").val(), (($("#step_2_date_of_birth_month").val() == "-") ? "01" : $("#step_2_date_of_birth_month").val()), (($("#step_2_date_of_birth_day").val() == "-") ? "01" : $("#step_2_date_of_birth_day").val()))) {
            if (lang == "en") {
                $("#step_2_date_of_birth_validate_msg").html("Invalid Date.");
            }
            if (lang == "tc") {
                $("#step_2_date_of_birth_validate_msg").html("日期不正確。");
            }
            if (lang == "sc") {
                $("#step_2_date_of_birth_validate_msg").html("日期不正确。");
            }
            $('html, body').animate({
                scrollTop: $("#step_2_date_of_birth_validate_msg").offset().top
            }, 500);
            return;
        }

        var child_name_valid_success = true;
        $("input[name*=step_2_child_eng_surname_]").each(function(i, obj) {
            var vaildate_mag = $(this).parents(".input-group").find(".step_2_child_name_validate_msg");

            $(vaildate_mag).html("");
            if ($("input[name*=step_2_child_chi_surname_"+ + (i + 1) +"]").val() == "" && $("input[name*=step_2_child_chi_givename_"+ + (i + 1) +"]").val() == "" && $("input[name*=step_2_child_eng_surname_"+ + (i + 1) +"]").val() == "" && $("input[name*=step_2_child_eng_givename_"+ + (i + 1) +"]").val() == "") {
                if(lang == "en")
    			{
    				$(vaildate_mag).html("Please fill in at least one name field.");
    			}
    			if(lang == "tc")
    			{
    				$(vaildate_mag).html("請填寫最少一個名字。");
    			}
    			if(lang == "sc")
    			{
    				$(vaildate_mag).html("请填写最少一个名字。");
    			}
                $('html, body').animate({
                    scrollTop: $(vaildate_mag).offset().top
                }, 500);
                child_name_valid_success = false;
                return;
            }

        });
        if (!child_name_valid_success) {
            return;
        }

        var child_bod_valid_success = true;
        $("select[name*=step_2_child_date_of_birth_day_]").each(function(i, obj) {
            var vaildate_mag = $(this).parent().find(".step_2_child_date_of_birth_validate_msg");

            $(vaildate_mag).html("");
            if (!is_validateDate($(".step_2_child_date_of_birth_year_" + (i + 1)).val(), (($(".step_2_child_date_of_birth_month_" + (i + 1)).val() == "-") ? "01" : $(".step_2_child_date_of_birth_month_" + (i + 1)).val()), (($(".step_2_child_date_of_birth_day_" + (i + 1)).val() == "-") ? "01" : $(".step_2_child_date_of_birth_day_" + (i + 1)).val()))) {
                if (lang == "en") {
                    $(vaildate_mag).html("Invalid Date.");
                }
                if (lang == "tc") {
                    $(vaildate_mag).html("日期不正確。");
                }
                if (lang == "sc") {
                    $(vaildate_mag).html("日期不正确。");
                }
                $('html, body').animate({
                    scrollTop: $(vaildate_mag).offset().top
                }, 500);
                child_bod_valid_success = false;
                return;
            }

        });
        if (!child_bod_valid_success) {
            return;
        }

        var child_name_valid_success = true;
        $("input[name*=step_2_child_fullname_alt_]").each(function(i, obj) {
            if ($(this).val() == "" && $("input[name*=step_2_child_fullname_" + (i + 1) + "").val() == "") {
                $(this).prop('required', true);
                $("input[name*=step_2_child_fullname_" + (i + 1) + "").prop('required', true);
                child_name_valid_success = false;
                return;
            }
        })
        if (!child_name_valid_success) {
            setTimeout(function() {
                $("#step_2_form_control_confirm").click();
            }, 200);
            return;
        }

        $("input[name*=step_2_child_nationality_").each(function(index) {
        	var natxt = $("div[name=step_2_child_nationality_" + (index+1) + "]");
            if($('.naChina').is(':checked')) {
         	   if(lang == "en")
     			{
         		  natxt.val("China");
     			}
     			if(lang == "tc")
     			{
     				natxt.val("中國");
     			}
     			if(lang == "sc")
     			{
     			 natxt.val("中国");
     			}
            }

        });

        var child_document_id_duplicate_valid_success = true;
        var child_document_id_list = [];
        child_document_id_list.push($('#step_2_documentId').val());
        $("input[name*=step_2_child_document_ID_").each(function(index) {
            var vaildate_mag = $("div[name=step_2_child_duplicate_validate_msg_" + (index+1) + "]");
            $(vaildate_mag).html("");

            var index = -1;
            for (var i = 0; i < child_document_id_list.length; ++i) {
                if (child_document_id_list[i] == $(this).val()) {
                    index = i;
                    break;
                }
            }

            if (index != -1) {
                if (lang == "en") {
                    $(vaildate_mag).html("Duplicated ID number.");
                }
                if (lang == "tc") {
                    $(vaildate_mag).html("號碼重覆。");
                }
                if (lang == "sc") {
                    $(vaildate_mag).html("号码重复。");
                }
                child_document_id_duplicate_valid_success = false;
                $('html, body').animate({
                    scrollTop: $(vaildate_mag).offset().top
                }, 500);
                return;
            }
            child_document_id_list.push($(this).val());
        })
        if (!child_document_id_duplicate_valid_success) {
            return;
        }

        $("#step_2_input_page input[name*='nationality_opt']:checked").each(function(index){
			$(this).parents(".radio_group_parent").hide();
			if($(this).val() == "China")
			{
				$(this).parents('.nationality_group').find('.text_input_nationality').val($("label[for="+$(this).attr("id")+"]").html()).prop("disabled", false);
		        $(".child_form .nationality_group").removeClass("childRadio");
			}
        });
        */
        if (!($(".input_confirm_control").is(":visible"))) {
            //show the confirmation page
            //show_confirm_page();
            $('html, body').animate({
                scrollTop: $(".step_2").offset().top
            }, 500);

            $(".review_input,.review_input_na").html("");
            $("#step_2_input_page input").not(':input[type=hidden], :input[type=checkbox], :input[type=radio], :input[type=button], :input[type=submit], :input[type=reset]').each(function(index) {
                $(this).hide();
                $(this).parent(".input-div").addClass("input-div-no-border");
                $(this).after('<span class="review_input input_span input_span_highlight">' + $(this).val() + '</span>');
            });

            $("#step_2_input_page textarea").not('#g-recaptcha-response-1').each(function(index) {
                $(this).hide();
                $(this).parent(".input-div").addClass("input-div-no-border");
                $(this).after('<span class="review_input input_span input_span_highlight">' + $(this).val() + '</span>');
            });

            $("#step_2_input_page select").each(function(index) {
                if ($("option:selected", this).hasClass("na")) {
                    $(this).hide();
                    $(this).parent(".input-div").addClass("input-div-no-border");
                } else {
                    $(this).hide();
                    $(this).parent(".input-div").addClass("input-div-no-border");
                    $(this).after('<span class="review_input input_span input_span_highlight">' + $(this).find("option:selected:first:not(:disabled)").text() + '</span>');
                }
            });

            $("#step_2_input_page input[type=radio]:checked").not($("#step_2_input_page input[name*='nationality_opt']")).each(function(index){
				$(this).parents(".radio_group_parent").children().hide();
				$(this).parents(".radio_group_parent").append('<span class="review_input input_span input_span_highlight">' + $("label[for="+$(this).attr("id")+"]").html() + '</span>');
			});

            $(".booking_selection_review").html('<span class="review_input input_span input_span_highlight">' + $("input[name='step_2_CBP_ID']:checked").html() + '</span>');
            $("#step_2_DEPART_DATE").val($("input[name='step_2_CBP_ID']:checked").attr("data-CBP_START_DATE"));
            $("#step_2_DEPART_END_DATE").val($("input[name='step_2_CBP_ID']:checked").attr("data-CBP_END_DATE"));

            $("#step_2_tel_for_sms_verification_area_code").next(".review_input").html($("#step_2_tel_for_sms_verification_area_code").next(".review_input").html().split(" ")[0]);

            $(".child_name_div").addClass("div_review_input");

            $(".formAreaCode").addClass("ddarea");

            $(".sms_flex").removeClass("sms_align_center");
            $(".step2_form_label").hide();
            $(".step2_form_review_label").show();

            $(".step_2_child_document_type").each(function(){
            	if($(this).is(":not(':checked')"))
            	{
            		$(this).parents(".mb-3").hide();
            	}
            });

            $(".input_review_control").hide();
            $(".input_confirm_control").show();
            return;
        }
        /*
        if ($("#form_consent").is(':checked') == false) {
            $("#form_consent").focus();
            $("#form_consent_validate_msg").html(eval("pics_err_" + lang));
            return;
        }

        if ($("#form_consent_1").is(':checked') == false) {
            $("#form_consent_1").focus();
            $("#form_consent_1_validate_msg").html(eval("pics_err_" + lang));
            return;
        }
        */
        $("#step_2_ccp_eng_name").remove();
        $("#step_2_ccp_tc_name").remove();
        $("#step_2_ccp_sc_name").remove();
        $("#step_2_departure_from_id").remove();

        $("#step_2_CBSP_ID").val($('input[name=step_2_entrance_port]:checked').attr("ccp_CBSP_ID"));
		$("#step_2_CBSP_LOCATION").val($('input[name=step_2_entrance_port]:checked').attr("ccp_CBSP_LOCATION"));

        $('#step_2_booking_form').prepend('<input type="hidden" id="step_2_ccp_eng_name" name="step_2_ccp_eng_name" value="' + $('input[name=step_2_entrance_port]:checked').attr("ccp_eng_name") + '">');
        $('#step_2_booking_form').prepend('<input type="hidden" id="step_2_ccp_tc_name" name="step_2_ccp_tc_name" value="' + $('input[name=step_2_entrance_port]:checked').attr("ccp_tc_name") + '">');
        $('#step_2_booking_form').prepend('<input type="hidden" id="step_2_ccp_sc_name" name="step_2_ccp_sc_name" value="' + $('input[name=step_2_entrance_port]:checked').attr("ccp_sc_name") + '">');
        $('#step_2_booking_form').prepend('<input type="hidden" id="step_2_departure_from_id" name="step_2_departure_from_id" value="' + $("#step_2_departure_from").find(":checked").attr("cdf-id") + '">');


        if($('#step_2_booking_form').find("input[name=_p]").length <= 0)
        {
	        $('#step_2_booking_form').prepend('<input type="hidden" id="" name="_p" value="0">');
        }

        var url = $(this).attr('action');

        $.ajax({
            type: "POST",
            url: a_dom + url,
            data: $(this).serialize(),
            success: function(data) {
                $("#step_2_captchaCode_validate_msg").html("");
                if (typeof step_2_captchaCode !== "undefined")
                {
                	grecaptcha.enterprise.reset(step_2_captchaCode);
                }
                var data = JSON.parse(data);

                if (data.result == "captcha invalid") {
                    $("#step_2_captchaCode_validate_msg").html("");
                    $("#step_2_captchaCode_validate_msg").html(eval("captcha_err_" + lang));
                } else if (data.appl_status == "P" || data.appl_status == "S") {
                	show_result_ack(data);
                	show_loading();
                } else {
                	step_2_retryLimit--;
                	if (step_2_retryLimit > 0) {
                		//try again
                		setTimeout(function(){
                			$('.step_2').addClass("invisible_label");
                			$('.step_2').show();
                			$('#step_2_booking_form').find("input[name=_p]").val("1");
                    		$('#step_2_booking_form').submit();
                    		if (!($(".step_loading").is(":visible"))) {
                    			show_target($(".step_loading"));
                    		}
                    		$('.step_2').hide().removeClass("invisible_label");
                		}, step_2_retry_Timeout);

                		if (!($(".step_loading").is(":visible"))) {
                			show_target($(".step_loading"));
                		}
                    }
                	else
                	{
                		$(".reg_app").show();
                		show_target($(".reg_failed"));
                	}
                }
            }
        });
    });
});

function show_loading()
{
	setTimeout(check_result, check_result_Timeout);
	show_target($(".step_loading"));
}

var check_result_retry_count = 5;
var check_result_retry_count_timeout = 3000;
function check_result()
{
	var url = $("#step_1_booking_form").attr('action');
	if( $("#step_1_documentId_HKIC").val() != "")
	{
		$.ajax({
	        type: "POST",
	        async: false,
	        url: a_dom + url,
	        data: {submit_action: "step_1", step_1_documentId: $("#step_1_documentId_HKIC").val(), ATH_REF_NO: $("#result_ack .ATH_REF_NO").html(), _p : "1"},
	        success: function(data) {

	        	var data = JSON.parse(data);
	        	if (data.is_booking_exist)
	        	{
	        		if (data.appl_status == "P"  || data.appl_status == "S") {
        				setTimeout(check_result, 10000);
        			}
	        		else if(typeof data.ATH_REF_NO == "undefined")
	        		{
	        			setTimeout(handleTimeout, 1800000);
                		//$("#cancel_booking_documentId_display").val(data.documentId);
                		if( data.ATH_NATCARDTYPE == "Hong Kong Identity Card")
                		{
                			$("#cancel_booking_documentId_display").val(hkid_display(data.documentId));
                		}
                		else
                		{
                			$("#cancel_booking_documentId_display").val(data.documentId);
                		}

                		$("#cancel_booking_documentId").val(data.documentId);

                		$("#step_2_documentId_display").val(data.documentId);
                		$("#step_2_documentId").val(data.documentId);

                		if(!CBSP_ID.includes(data.CBSP_ID))
                		{
                		   //$("#cancel_booking_form_control .goto_step_2").show();
                		}
						show_target($(".step_cancel_booking"));
	        		}
	        		else if (data.appl_status == "A") {
        				show_result_success(data);
        			} else if (data.appl_status.indexOf("R") != -1) {
        				//Show application failure
        				show_result_reject(data);
        			}
	        	}
	        	else if(typeof data.ATH_VALIDATE_RESULT != "undefined" && $("#step_2_fullname").val() != "")
	        	{
	        		if(data.ATH_VALIDATE_RESULT != "RQ")
	        		{
		        		if(data.ATH_VALIDATE_RESULT == "1")
		        		{
		        			indicate_error(data.ATH_NATCARDID, "main");
		        		}

		        		if (data.appl_CHILDREN.length > 0) {
		        	        $(data.appl_CHILDREN).each(function(i, child) {
		        	        	if(child.ATH_VALIDATE_RESULT == "1")
		    	        		{
		        	        		indicate_error(child.ATH_NATCARDID, "child");
		    	        		}
		        	        })
		        	    }
	        		}
	        		show_target($(".step_2"));
	        		setTimeout(function(){
	        			$('html, body').animate({
		                    scrollTop: $(".applicant_error_msg:visible:first").offset().top
		                }, 500);
	        		}, 500);

	        		$(".step_2_cancel_button").click();
	        	}
	        	else if($("#result_ack .ATH_REF_NO").html() == "")
	        	{
					show_target($(".note_2"));
	        	}
	        	else
	        	{
	        		check_result_retry_count--;
	        		if(check_result_retry_count > 0)
	        		{
	        			setTimeout(check_result, check_result_retry_count_timeout);
	        		}
	        		else
	        		{
	        			$(".reg_app").show();
	        			show_target($(".reg_failed"));
	        		}
	        	}
	        }
		});
	}
}

function indicate_error(documentId, from)
{
	if(from == "main")
	{
		$("#main_applicant_error_msg").show();
	}
	if(from == "child")
	{
		$("input[name*=step_2_child_documentId_HKIC_prefix_]").each(function(){

			if($(this).val() == documentId.slice(0, documentId.length-1))
			{
				$(this).parents(".child_form").find(".child_applicant_error_msg").show();
			}
		})
	}
}

function show_result_ack(data) {
    $("#result_ack .ATH_REF_NO").html(data.ATH_REF_NO);
}

function show_cancel_detail(data) {
	//$("#cancel_booking_documentId_display").val(data.ATH_NATCARDID);
	//$("#cancel_booking_documentId").html(data.ATH_NATCARDID);
	//$("#cancel_booking_documentId_display").val(data.ATH_NATCARDID);
	if(data.ATH_NATCARDTYPE == "Hong Kong Identity Card")
	{
		$("#cancel_booking_documentId_display").val(hkid_display(data.ATH_NATCARDID));
	}
	else
	{
		$("#cancel_booking_documentId_display").val(data.ATH_NATCARDID);
	}

	$("#cancel_booking_documentId").val(data.ATH_NATCARDID);
	item_display_str = moment(data.ATH_DEPART_DATE, 'YYYY-MM-DD').format('YYYY/MM/DD (dddd)');

    $("#cancel_booking .DEPART_DATE_PERIOD").val(item_display_str);
    $("#cancel_booking .REF_NO").val(data.ATH_REF_NO);
    $("#cancel_booking_refno").val(data.ATH_REF_NO);
    $("#cancel_booking .CHILDREN_NUM").val(data.appl_CHILDREN.length);
    $('#cancel_booking .PURPOSE_OF_ENTRY').val(get_purpose(data.ATH_PURPOSE_OF_ENTRY));

    $(".review_input,.review_input_na").html("");
    $("#cancel_booking input").not(':input[type=hidden], :input[type=radio], :input[type=button], :input[type=submit], :input[type=reset]').each(function( index ){
	   $(this).hide();
	   $(this).parent(".input-div").addClass("input-div-no-border");
	   $(this).after('<span class="review_input input_span input_span_highlight">' + $(this).val() + '</span>');
    });

    $("#cancel_booking .display").removeClass("dtl");
	$("#cancel_booking .input_review_control").hide();
	$("#cancel_booking  .input_confirm_control").show();
	$('#cancel_booking_enquiry_captchaCode').empty();

	if(data.ATH_LD_STATUS == "Confirmed")
	{
		$(".go_cancel").parent(".input-submit-div").hide();
	}
}

function show_result_success(data) {
	$("#booking_result .ATH_NATCARDTYPE").html(get_ATGC_NATCARDTYPE(data.ATH_NATCARDTYPE));
	$("#booking_result .ATH_REF_NO").html(data.ATH_REF_NO);

	if( data.ATH_NATCARDTYPE == "Hong Kong Identity Card")
	{
		$("#booking_result .ATH_NATCARDID").html(hkid_display(data.ATH_NATCARDID));
	}
	else
	{
		$("#booking_result .ATH_NATCARDID").html(data.ATH_NATCARDID);
	}

    $('#booking_result .ATH_NATIONALITY').html(data.ATH_NATIONALITY);
    $('#booking_result .ATH_NAME_CONTACT_PERSON').html(data.ATH_NAME_CONTACT_PERSON);
    $('#booking_result .ATH_EMAIL_CONTACT_PERSON').html(data.ATH_EMAIL_CONTACT_PERSON);
    $('#booking_result .ATH_FDH_NAME').html(data.ATH_FDH_NAME);
    $('#booking_result .ATH_FDH_NATIONALITY').html(data.ATH_FDH_NATIONALITY);
    if(data.ATH_NAME_EMPLOYMENT_AGENCY != "")
    {
    	$('#booking_result .ATH_NAME_EMPLOYMENT_AGENCY').html(data.ATH_NAME_EMPLOYMENT_AGENCY);
    	$('#booking_result .ATH_NAME_EMPLOYMENT_AGENCY').parent().parent().removeClass("hide");
    }
    if(data.ATH_FDH_HKID != "")
    {
    	$('#booking_result .ATH_FDH_HKID').html(data.ATH_NAME_EMPLOYMENT_AGENCY);
    	$('#booking_result .ATH_FDH_HKID').parent().parent().removeClass("hide");
    }


    var ATH_FDH_COMM_ENG = "Yes";
    if (lang == "tc") {
    	ATH_FDH_COMM_ENG = "是";
    }
    if (lang == "sc") {
    	ATH_FDH_COMM_ENG = "是";
    }
    if (data.ATH_FDH_COMM_ENG == "No")
    {
    	if (lang == "en") {
    		ATH_FDH_COMM_ENG = "No";
    	}
    	if (lang == "tc") {
    		ATH_FDH_COMM_ENG = "否";
    	}
    	if (lang == "sc") {
    		ATH_FDH_COMM_ENG = "否";
    	}
    }


    $('#booking_result .ATH_FDH_COMM_ENG').html(ATH_FDH_COMM_ENG);

    item_display_str = moment(data.ATH_DEPART_DATE, 'YYYY-MM-DD').format('YYYY/MM/DD (dddd)');
    $('#booking_result .ATH_DEPART_DATE_PERIOD').html(item_display_str);
    item_display_end_str = moment(data.ATH_DEPART_DATE, "YYYY-MM-DD").add(parseInt(data.ATH_QUARANTINE_DURATION) - parseInt(data.ATH_QUARANTINE_DURATION_CLEANING_DAY_COUNT), 'day').format('YYYY/MM/DD (dddd)')
    $('#booking_result .ATH_DEPART_END_DATE_PERIOD').html(item_display_end_str);

    if(data.ATH_TEL_FOR_SMS_NOTIF == "")
    {
    	$('#booking_result .ATH_TEL_FOR_SMS_NOTIF').parents(".flex-center").hide();
    }
    else
    {
    	$('#booking_result .ATH_TEL_FOR_SMS_NOTIF').html("+" + data.ATH_TEL_AREA_CODE_FOR_SMS + " " + data.ATH_TEL_FOR_SMS_NOTIF);
    }


    var CCP_NAME = "";
    if (lang == "en") {
    	CCP_NAME = data.ATH_CCP_ENG_NAME;
    }
    if (lang == "tc") {
    	CCP_NAME = data.ATH_CCP_CHI_NAME;
    }
    if (lang == "sc") {
    	CCP_NAME = data.ATH_CCP_SCHI_NAME;
    }
    $('#booking_result .ATH_CCP_NAME').html(CCP_NAME);


    $.each(avalible_departure_from, function(index, df){

    	if(df.CDF_ENG_NAME == data.ATH_DEPARTURE_FROM)
        {
    		var display_label = "";
    		if (lang == "en") {
    			display_label = df.CDF_ENG_NAME;
    	    }
    	    if (lang == "tc") {
    	    	display_label = df.CDF_CHI_NAME;
    	    }
    	    if (lang == "sc") {
    	    	display_label = df.CDF_SCHI_NAME;
    	    }

        	$('#booking_result .ATH_DEPARTURE_FROM').html(display_label);
        	$('.result_departure_from').css("display", "flex");

        	return false;
        }
    })



    $(".result_notes").hide();
    if(data.ATH_CCP_ENG_NAME.indexOf("Airport") > 0)
    {
    	$(".result_notes.hk_airport").show();
    }
    else
    {
    	$(".result_notes.land_based").show();
    }

	show_target($("#booking_result"));

	if($('.enq_form').length == 0 && lang == "en") {
		$('.print_area').addClass('dimmed');
		setTimeout(function(){alert("Please keep and carefully protect the reference number for subsequent login to the system for enquiry or cancellation of appointment."); $('.print_area').removeClass('dimmed');},500);
    }
    if($('.enq_form').length == 0 && lang == "tc") {
    	$('.print_area').addClass('dimmed');
    	setTimeout(function(){alert("請記下並小心保管申請編號，以便日後再登錄系統查詢或取消預約。");$('.print_area').removeClass('dimmed');},500);
    }
    if($('.enq_form').length == 0 && lang == "sc") {
    	$('.print_area').addClass('dimmed');
    	setTimeout(function(){alert("请记下并小心保管申请编号，以便日后再登录系统查询或取消预约。");$('.print_area').removeClass('dimmed');},500);
    }
}

function get_mainland_travel_document_type(doc)
{
	if (doc == "Mainland Travel Permit for Hong Kong and Macao Residents") {
        if (lang == "en") {
        	doc = "Mainland Travel Permit for Hong Kong and Macao Residents";
        }
        if (lang == "tc") {
        	doc = "回鄉證";
        }
        if (lang == "sc") {
        	doc = "回乡证";
        }
    } else if (doc == "Other travel document") {
        if (lang == "en") {
        	doc = "Other travel document";
        }
        if (lang == "tc") {
        	doc = "其他旅遊證件";
        }
        if (lang == "sc") {
        	doc = "其他旅游证件";
        }
    }
	return doc;
}


function get_purpose(purpose)
{
	if (purpose == "Business") {
        if (lang == "en") {
        	purpose = "Business";
        }
        if (lang == "tc") {
        	purpose = "商務";
        }
        if (lang == "sc") {
        	purpose = "商务";
        }
    } else if (purpose == "Official") {
        if (lang == "en") {
        	purpose = "Official";
        }
        if (lang == "tc") {
        	purpose = "公務";
        }
        if (lang == "sc") {
        	purpose = "公务";
        }
    } else if (purpose == "Special circumstances (attending funeral, medical emergency, seeking medical treatment)") {
        if (lang == "en") {
        	purpose = "Special circumstances (attending funeral, medical emergency, seeking medical treatment)";
        }
        if (lang == "tc") {
        	purpose = "特殊情況（奔喪、緊急醫療情況、就醫）";
        }
        if (lang == "sc") {
        	purpose = "特殊情况（奔丧、紧急医疗情况、就医）";
        }
    }
	return purpose;
}

function get_gender(gender) {
    if (gender == "M") {
        if (lang == "en") {
            gender = "Male";
        }
        if (lang == "tc") {
            gender = "男性";
        }
        if (lang == "sc") {
            gender = "男性";
        }
    } else if (gender == "F") {
        if (lang == "en") {
            gender = "Female";
        }
        if (lang == "tc") {
            gender = "女性";
        }
        if (lang == "sc") {
            gender = "女性";
        }
    }

    return gender;
}

function hkid_display(str)
{
	return str.slice(0, str.length-1) + "(" +  str[str.length -1] + ")";
}

function get_ATGC_NATCARDTYPE(type)
{
	if(type == "1"){if(lang == "en"){type = "Permit for Proceeding to Hong Kong and Macao";}if(lang== "tc"){type="前往港澳通行證（單程證 ）";}if(lang == "sc"){type="前往港澳通行证（单程证 ）";}}
	if(type == "2"){if(lang == "en"){type = "Exit/Entry Permit for Travelling to and from Hong Kong and Macao";}if(lang== "tc"){type="往來港澳通行證（雙程證 ）";}if(lang == "sc"){type="往来港澳通行证（双程证 ）";}}
	if(type == "3"){if(lang == "en"){type = "Re-entry Permit";}if(lang== "tc"){type="回港證";}if(lang == "sc"){type="回港证";}}
	if(type == "4"){if(lang == "en"){type = "Document of Identity for Visa Purposes";}if(lang== "tc"){type="簽證身份書";}if(lang == "sc"){type="签证身份书";}}
	if(type == "5"){if(lang == "en"){type = "People’s Republic of China Passport";}if(lang== "tc"){type="中國護照";}if(lang == "sc"){type="中国护照";}}
	if(type == "6"){if(lang == "en"){type = "People's Republic of China Resident Identity Card";}if(lang== "tc"){type="中華人民共和國居民身份證";}if(lang == "sc"){type="中华人民共和国居民身份证";}}
	if(type == "7"){if(lang == "en"){type = "Macao Special Administrative Region (SAR) Resident Identity Card";}if(lang== "tc"){type="澳門特別行政區居民身份證";}if(lang == "sc"){type="澳门特别行政区居民身份证";}}
	if(type == "99"){if(lang == "en"){type = "Passport or travel document";}if(lang== "tc"){type="護照或旅遊證件";}if(lang == "sc"){type="护照或旅游证件";}}
	if(type == "Indonesian Passport"){if(lang == "en"){type = "Indonesian Passport";}if(lang== "tc"){type="印尼護照";}if(lang == "sc"){type="印尼护照";}}
	if(type == "Indian Passport"){if(lang == "en"){type = "Indian Passport";}if(lang== "tc"){type="印度護照";}if(lang == "sc"){type="印度护照";}}
	if(type == "Indonesian Passport"){if(lang == "en"){type = "Indonesian Passport";}if(lang== "tc"){type="印尼護照";}if(lang == "sc"){type="印尼护照";}}
	if(type == "Malaysian Passport"){if(lang == "en"){type = "Malaysian Passport";}if(lang== "tc"){type="馬來西亞護照";}if(lang == "sc"){type="马来西亚护照";}}
	if(type == "Pakistani Passport"){if(lang == "en"){type = "Pakistani Passport";}if(lang== "tc"){type="巴基斯坦護照";}if(lang == "sc"){type="巴基斯坦护照";}}
	if(type == "Philippine Passport"){if(lang == "en"){type = "Philippine Passport";}if(lang== "tc"){type="菲律賓護照";}if(lang == "sc"){type="菲律宾护照";}}
	if(type == "Thai Passport"){if(lang == "en"){type = "Thai Passport";}if(lang== "tc"){type="泰國護照";}if(lang == "sc"){type="泰国护照";}}
	if(type == "Bangladeshi Passport"){if(lang == "en"){type = "Bangladeshi Passport";}if(lang== "tc"){type="孟加拉護照";}if(lang == "sc"){type="孟加拉护照";}}
	if(type == "Nepalese Passport"){if(lang == "en"){type = "Nepalese Passport";}if(lang== "tc"){type="尼泊爾護照";}if(lang == "sc"){type="尼泊尔护照";}}
	if(type == "Singaporean Passport"){if(lang == "en"){type = "Singaporean Passport";}if(lang== "tc"){type="新加坡護照";}if(lang == "sc"){type="新加坡护照";}}
	if(type == "United Arab Emirate Passport"){if(lang == "en"){type = "United Arab Emirate Passport";}if(lang== "tc"){type="阿拉伯聯合酋長國護照";}if(lang == "sc"){type="阿拉伯联合酋长国护照";}}
	if(type == "Other Identity Documents"){if(lang == "en"){type = "Other Identity Documents";}if(lang== "tc"){type="其他身份證明文件";}if(lang == "sc"){type="其他身份证明文件";}}
	if(type == "Hong Kong Identity Card"){if(lang == "en"){type = "Hong Kong Identity Card";}if(lang== "tc"){type="香港特別行政區身份證";}if(lang == "sc"){type="香港特别行政区身份证";}}
	return type;
}

function check_if_under_age_11(child_num_suffix)
{
	return;
	if($(".step_2_child_date_of_birth_year" + child_num_suffix).val() == null || $(".step_2_child_date_of_birth_month" + child_num_suffix).val() == null || $(".step_2_child_date_of_birth_day" + child_num_suffix).val() == null)
		{
			return;
		}
    if (is_under_eleven_AgeValidate($(".step_2_child_date_of_birth_year" + child_num_suffix).val() + "/" + (($(".step_2_child_date_of_birth_month" + child_num_suffix).val() == "-") ? "01" : $(".step_2_child_date_of_birth_month" + child_num_suffix).val()) + "/" + (($(".step_2_child_date_of_birth_day"+ child_num_suffix).val() == "-") ? "01" : $(".step_2_child_date_of_birth_day"+ child_num_suffix).val())))
    {
    	$("input[name=step_2_child_document_type_radio" + child_num_suffix+ "]").prop("disabled", false);
    	$("input[name=step_2_child_documentId_HKIC_prefix" + child_num_suffix+ "]").val("").prop("required", false);
    	$("input[name=step_2_child_documentId_HKIC_check_digit" + child_num_suffix+ "]").val("").prop("required", false);
    	$("input[name=step_2_child_other_document_ID" + child_num_suffix+ "]").val("").prop("required", false)
    }
    else
    {
    	$("input[name=step_2_child_document_type_radio" + child_num_suffix+ "]").prop("disabled", true);
    	$("input[name=step_2_child_documentId_HKIC_prefix" + child_num_suffix+ "]").val("").prop("required", true).prop("disabled", false);
		$("input[name=step_2_child_documentId_HKIC_check_digit" + child_num_suffix+ "]").val("").prop("required", true).prop("disabled", false);
		$("input[name=step_2_child_other_document_ID" + child_num_suffix+ "]").val("").prop("required", false).prop("disabled", true);
    	$("input[id=step_2_child_HKID_document_ID_radio" + child_num_suffix+ "]").prop("disabled", false).prop("checked", true);
    }

}

function is_under_eleven_AgeValidate(birthday) {
    birthday = new Date(birthday.replace(/-/g, "/"));
    var year = birthday.getFullYear();
    var month = birthday.getMonth();
    var day = birthday.getDate();
    return !(new Date(year + 11, month, day) < new Date());
}

var form_action_path = "/booking/api_hk";
var sms_verification_duration = 180;
var sms_timer = 0;
var sms_internval =0;
var sms_try_count = 0;
var sms_verification_left_arr = [];
function startTimer(duration, display) {
	sms_timer = duration;
	sms_internval = setInterval(function() {
		var minutes = parseInt(sms_timer / 60, 10)
		var seconds = parseInt(sms_timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.html(minutes + ":" + seconds);

		if (--sms_timer < 0) {
			$("#step_2_tel_for_sms_verification_ref_no").val("");
			$(".step_2_tel_for_sms_verification_left").html("");
			$("#step_2_tel_for_sms_verification_left").val("");
			$("#step_2_tel_for_sms_verification_right").val("");
			$(".step_2_tel_for_sms_verification_right").hide();
			$(".step_2_tel_for_sms_verification_r_div ").hide();
			$("#step_2_tel_for_sms_verification_r").html("");
			if(lang == "en")
			{
				$("#step_2_tel_for_sms_verification_submit").html("Obtain the verification code again");
				$("#step_2_tel_for_sms_verification_validate_msg").html("Verification fail.");
			}
			if(lang == "tc")
			{
				$("#step_2_tel_for_sms_verification_submit").html("重新獲取驗證碼");
				$("#step_2_tel_for_sms_verification_validate_msg").html("驗證失敗。");
			}
			if(lang == "sc")
			{
				$("#step_2_tel_for_sms_verification_submit").html("重新获取验证码");
				$("#step_2_tel_for_sms_verification_validate_msg").html("验证失败。");
			}

			clearInterval(sms_internval);
		}
  }, 1000);
}

function start_sms_timer() {
  display = $('#sms_verification_counter');
  startTimer(sms_verification_duration, display);
};

function reset_SMS_verification()
{
	$("#step_2_tel_for_sms_verification_r").html("");
	$(".step_2_tel_for_sms_verification_r_div").hide();
	$("input[name*=step_2_tel_for_sms_notif], #step_2_tel_for_sms_verification_right").prop("readonly", false);
	sms_try_count = 0;

	if(lang == "en")
	{
		$("#step_2_tel_for_sms_verification_submit").html("Obtain the verification code");
	}
	if(lang == "tc")
	{
		$("#step_2_tel_for_sms_verification_submit").html("獲取SMS驗證碼");
	}
	if(lang == "sc")
	{
		$("#step_2_tel_for_sms_verification_submit").html("获取SMS验证码");
	}

	$(".sms_verification_input_section").show();
	$("#step_2_tel_for_sms_verification_success").val("0")
	$("#step_2_tel_for_sms_verification_ref_no").val("");
	$(".step_2_tel_for_sms_verification_left").html("");
	$("#step_2_tel_for_sms_verification_left").val("");
	$("#step_2_tel_for_sms_verification_right").val("")
	$(".step_2_tel_for_sms_verification_right").hide();
	$("#step_2_tel_for_sms_verification_validate_msg").html("");
	$("#step_2_tel_for_sms_verification_submit_div").show();
	$("#step_2_form_control_confirm_div").addClass("input-submit-div-disabled");
}

function show_target(jtarget)
{
	$('.reg_failed').slideUp();
	$('.enq_form').slideUp();
	$('.step_loading').slideUp();
	$('.step_cancel_booking').slideUp();
	$('.step_cancel_success').slideUp();
	$('.step_1').slideUp();
	$('.note_2').slideUp();
	$('.step_2').slideUp();
	$('#booking_result').slideUp();
	$('#result_ack').slideUp();
	$('#booking_reject').slideUp();

	jtarget.slideDown();

	$('html, body').animate({
        scrollTop: 0
    }, 500);
}
