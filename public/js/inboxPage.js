/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 5/1/2022
 */


var addUserButtonMainDIv = document.getElementById('addUserButtonMainDIv');
var addUserButtonMainDIvImage = document.querySelector('#addUserButtonMainDIv > a > img');
var modalWrapper = document.querySelector('.modal-wrapper');
var closeModal = document.querySelector('.modal-close');
var selectUserOption = document.getElementById('selectUserOption');
var chattitle = $('#chat-title');
var chatTitleSpan = chattitle[0].children[0];
var chatTitleImage = chattitle[0].children[1];
var chatMessageList = document.getElementById('chat-message-list');
var textInputField = document.getElementById('textInputField');
var loggedInUserId = document.getElementById('loggedInUserId');
var participantUserId = document.getElementById('participantUserId');
var conversationId = document.getElementById('conversationId');

// close modal
closeModal.addEventListener('click', function (e) {
    modalWrapper.classList.remove('show-modal');
});

// add user button animation
addUserButtonMainDIv.addEventListener('click', function (e) {

    addUserButtonMainDIvImage.classList.add('zoom-in-zoom-out');

    setTimeout(function () {
        addUserButtonMainDIvImage.classList.remove('zoom-in-zoom-out');
    }, 1000);

    modalWrapper.classList.add('show-modal');
});

// select user and ajx post
selectUserOption.addEventListener('change', function (e) {
    var selectedUserId = e.target.value;
    let url = '/inbox/create/conversation';
    let loggedInUserID = '<%= loggedInUser.id %>';

    let postData = {
        creator: loggedInUserID,
        participant: selectedUserId
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
        , body: JSON.stringify(postData)
    }).then(response => response.json())
        .then(data => console.log(data, loggedInUserID, loggedInUserName))
        .catch((error) => console.error('Error:', error));
});

// to convert date format
function convertDate() {
    let created_date = document.querySelector('.created-date');
    let date = new Date(created_date.innerHTML);
    let options = {
        weekday: "long", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    created_date.innerHTML = date.toLocaleDateString("en-US", options);
}

// get user all conversation list
async function getConversationList(reference, conversation_id, participant_id) {
    participantUserId.value = participant_id;
    conversationId.value = conversation_id;
    let url = '/inbox/getConversationList';
    clickedUserInfo(reference);

    let postData = {
        conversation_id: conversation_id
    };


    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });

    let responseJson = await response.json();

    if (responseJson.error) {
        Toastify({
            text: 'Something went wrong',
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #ff6c6c, #f66262)",
            stopOnFocus: true // Prevents dismissing of toast on hover
        }).showToast();
    } else {
        console.log(responseJson);
    }
}


// send message

textInputField.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        let text = $(this).val();
        let loggedInUserID = loggedInUserId.value;
        let participantUserID = participantUserId.value;
        let conversationID = conversationId.value;
        let url = '/inbox/sendMessage';

        if (participantUserID && (participantUserID !== loggedInUserID)) {
            let postData = {
                conversation_id: conversationID,
                sender_id: loggedInUserID,
                receiver_id: participantUserID,
                message: text
            };

            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
                , body: JSON.stringify(postData)
            });
        }

    }
});


// inbox page init function
function init() {
    convertDate();

    chatTitleSpan.innerHTML = ' ';
    chatTitleImage.style.display = 'none';
}


function clickedUserInfo(reference) {
    let userTitle = reference.children[1];
    let userImage = reference.children[0];

    chatTitleSpan.innerHTML = userTitle.innerHTML;
    chatTitleImage.style.display = 'block';
}


init();