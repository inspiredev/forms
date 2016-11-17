'use strict';

/* global jQuery */
jQuery(document).ready(function ($) {
	// toggle notify-email field type
	$('[name=notify-email-type]').on('change', function (e) {
		var type = $(e.target).val();
		if (type !== 'email') {
			$('[name=notify-email]').attr('type', 'text');
		} else {
			$('[name=notify-email]').attr('type', 'email');
		}
	});
	$('#new-form-submit').on('click', function (e) {
		e.preventDefault();
		var $form = $('#new-form');
		$form.validate({});
		if (!$form.valid()) {
			return;
		}
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: $form.serialize(),
			success: function (data, status) {
				var successMessage = '';
				successMessage += '<p>Your form has been created.</p>';
				successMessage += '<p>You can start POSTing entries to it at http://inspired-forms.herokuapp.com/forms/' + data._id;
				$('.alert').html(successMessage).addClass('alert-success');
				$form.empty();
			}
		});
	});
	$('#edit-form-submit').on('click', function (e) {
		e.preventDefault();
		var $form = $('#edit-form');
		$form.validate({});
		if (!$form.valid()) {
			return;
		}
		$.ajax({
			url: window.location.href,
			type: 'PUT',
			data: $form.serialize(),
			success: function (data, status) {
				var successMessage = '';
				successMessage += '<p>Your form has been saved.</p>';
				$('.alert').html(successMessage).addClass('alert-success');
			}
		});
	});
});

