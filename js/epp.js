$('#dd__menu, #allotment_schedule').DropDown();
$( "#wgi" ).on('click', function(event) {

    var def = $(this)[0].id;
    $.modal({title: 'Last WGI Date', parentID: def, content: '<p>Within Grade Increases (WGIs) are the result of personnel actions processed by your agency\'s servicing Personnel Office, and are not automatic.</p><p>Due to the differences in policies and regulations at many NFC-serviced agencies, NFC is not authorized to attempt to project the possible date of your next WGI.</p><p>For information regarding your WGI, please contact your immediate supervisor and/or your servicing Personnel Office.</p>', footer: '<div class="button-group align--right"><button type="reset" class="button button--gray modal__close">Close</button></div>'});

    event.preventDefault();

});
$( ".allotment_info_button" ).on('click', function(event) {
    var $this = $(this)[0],
        $title = document.getElementById($this.getAttribute('aria-describedby')).innerHTML;

    $.modal({title: $title, parentID: $this.id, content: '<p><strong>Bank:</strong> Bank of America (051000017)</p><p><strong>Account Number:</strong> ******1422</p><p><strong>Account Type:</strong> Checking</p>', footer: '<div class="button-group button-group--directional"><button class="button button--gray modal__close">Close</button><button class="button button--blue">Change Allotment</button></div>'});

    event.preventDefault();

});

$('input[name="payment"]').on('change', function() {
    $type = $(this).val();
    if($type == 'check') {
        document.querySelector('.payment_section.eft').style.display = 'none';
        document.querySelector('.payment_section.check').style.display = 'block';
    }else{
        document.querySelector('.payment_section.eft').style.display = 'block';
        document.querySelector('.payment_section.check').style.display = 'none';
    }
});

if(navigator.serviceWorker) {
    navigator.serviceWorker.register('/serviceworker.js');
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  return false;
});

$('#add_to_homescreen').on('click', function() {
    if(deferredPrompt) {
    // The user has had a postive interaction with our app and Chrome
    // has tried to prompt previously, so let's show the prompt.
    deferredPrompt.prompt();

    // Follow what the user has done with the prompt.
    deferredPrompt.userChoice.then(function(choiceResult) {

    console.log(choiceResult.outcome);

    // We no longer need the prompt.  Clear it up.
    deferredPrompt = null;
    });
    }
})