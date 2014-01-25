$(document).ready(function(){
	console.log('ready!');
	$('#new-form-submit').on('click', function(e) {
		e.preventDefault();
		var $form = $("#new-form");
		$form.validate({

		});
		if (!$form.valid()) {
			return;
		}
		$.ajax({
			url: '/forms',
			type: 'POST',
			data: $form.serialize(),
			success: function(data, status) {
				console.log(data);
				console.log(status);
			}
		});
	})
});