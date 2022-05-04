/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 5/1/2022
 */


// important variables

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
var conversationList = document.getElementById('conversation-list');
var socket = io('http://localhost:3000');

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
    let loggedInUserID = loggedInUserId.value;

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
    }).then(response => {
        modalWrapper.classList.remove('show-modal');
        let mainResponse = response;
        let jsonResponse = response.json();

        jsonResponse.then(data => {
            if (mainResponse.status === 200) {
                Toastify({
                    text: data.message,
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: 'right', // `left`, `center` or `right`
                    stopOnFocus: true // Prevents dismissing of toast on hover
                }).showToast();
            } else if (mainResponse.status === 201) {
                Toastify({
                    text: data.message,
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: 'right', // `left`, `center` or `right`
                    stopOnFocus: true // Prevents dismissing of toast on hover
                }).showToast();

                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            }
        });

    })
        .catch((error) => {
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
        });
});


// to convert date format
function convertDate() {
    let created_date = document.querySelector('.created-date');

    if (created_date) {
        let date = new Date(created_date.innerHTML);
        let options = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        created_date.innerHTML = date.toLocaleDateString("en-US", options);
    }
}


// get user all conversation list
async function getConversationList(reference, conversation_id, participant_id) {
    chatMessageList.innerHTML = '';

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
        let badge = $('#badg-' + conversation_id);

        badge.innerText = 0;
        badge.hide();


        let conversatyions = responseJson.conversations;

        for (let conversatyionsKey in conversatyions) {
            let conversationInfo = conversatyions[conversatyionsKey];

            if (conversationInfo.sender.id === loggedInUserId.value) {
                chatMessageList.append(createSenderDiv(conversationInfo));
            } else {
                chatMessageList.append(createReceiverDiv(conversationInfo));
            }
        }
        scrollToBottom(chatMessageList);
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


        if (participantUserID) {

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
                let conversatyions = responseJson.data;
                chatMessageList.appendChild(createSenderDiv(conversatyions))
                $(this).val('');
                scrollToBottom(chatMessageList);
            }

        }

    }
});


socket.on('send_message', function (emmitData) {

    if (emmitData.sender.id !== loggedInUserId.value) {

        updateMessageList(emmitData.conversation_id);

        let getConversationDiv = document.querySelector(`[data-conversationId="${emmitData.conversation_id}"]`);

        if (conversationId.value.length > 0) {
            if (conversationId.value == emmitData.conversation_id) {
                chatMessageList.appendChild(createReceiverDiv(emmitData));
                scrollToBottom(chatMessageList);
            } else {
                createConversationListDiv(emmitData);
            }
        } else {
            createConversationListDiv(emmitData);
        }


    }
});


// create conversation list div
function createConversationListDiv(conversationInfo) {
    let getConversationDiv = document.querySelector(`[data-conversationId="${conversationInfo.conversation_id}"]`);

    if (typeof (getConversationDiv) == 'undefined' && getConversationDiv == null) {
        let conversation = createElement('div', 'conversation');
        let userImage = createElement('div', 'user-image');
        let badge = createElement('span', 'badge badge--smaller badge--info');
        let avatar = createElement('img', 'avatar');
        let titleText = createElement('div', 'title-text');
        let date = createElement('div', 'conversation-message created-date');

        // main conversation list div
        let getConversationListFunction = "getConversationList(this, '" + conversationInfo.conversation_id + "', '" + conversationInfo.receiver.id + "')";
        conversation.setAttribute('onclick', getConversationListFunction);

        // badge configuration
        badge.setAttribute('id', 'badg-' + conversationInfo.conversation_id);
        badge.innerText = 1;

        // user avater configuration
        let src = (conversationInfo.receiver.avatar) ? ('./uploads/avatars/' + conversationInfo.receiver.avatar) : './images/user1.png';
        let style = (conversationInfo.receiver.avatar) ? 'grid-row: span 2;width: 40px;height: 40px;border-radius: 100%;border: 2px solid var(--blue);' : '';
        avatar.setAttribute('src', src);
        avatar.setAttribute('style', style);
        avatar.setAttribute('alt', conversationInfo.receiver.name);

        // title text configuration
        titleText.innerText = conversationInfo.receiver.name;

        // date configuration
        date.innerText = conversationDateFormat(conversationInfo.created_at);

        // append child
        userImage.appendChild(badge);
        userImage.appendChild(avatar);

        conversation.appendChild(userImage);
        conversation.appendChild(titleText);
        conversation.appendChild(date);

        conversationList.appendChild(conversation);
    }
}


// update message list
function updateMessageList(conversation_id) {
    let getConversationDiv = document.querySelector(`[data-conversationId="${conversation_id}"]`);
    if (getConversationDiv) {
        if (conversation_id != conversationId.value) {
            let badge = $('#badg-' + conversation_id);

            if (badge.is(':visible')) {
                let currentBadge = parseInt(badge.text());
                badge.text(currentBadge + 1);
            } else {
                badge.show();
                badge.innerText = 1;
            }
        }
    }

}


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


function conversationDateFormat(dateToConvert) {
    let date = new Date(dateToConvert);
    return date.toLocaleDateString("en-US", {
        weekday: "long", hour: "2-digit", minute: "2-digit"
    });
}


function createSenderDiv(senderData) {
    let senderDiv = createElement('div', 'message-row you-message');
    let messageText = createElement('div', 'message-text', senderData.text);
    let messageTime = createElement('div', 'message-time', conversationDateFormat(senderData.created_at));
    let messageContent = createElement('div', 'message-content');

    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    senderDiv.appendChild(messageContent);

    return senderDiv;
}


function createReceiverDiv(receiverData) {
    let senderDiv = createElement('div', 'message-row other-message');
    let messageText = createElement('div', 'message-text', receiverData.text);
    let messageTime = createElement('div', 'message-time', conversationDateFormat(receiverData.created_at));
    let messageContent = createElement('div', 'message-content');
    let participantImage = createElement('img');
    console.log(receiverData)
    if (receiverData.receiver.avatar) {
        participantImage.src = ('./uploads/avatars/' + receiverData.receiver.avatar);
        participantImage.alt = receiverData.receiver.name;
    } else {
        participantImage.src = './images/nophoto.png';
    }

    messageContent.appendChild(participantImage);
    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    senderDiv.appendChild(messageContent);

    return senderDiv;
}


function createElement(element, className, innerHTML = null) {
    let elementToCreate = document.createElement(element);
    elementToCreate.className = className;
    if (innerHTML != null) {
        elementToCreate.innerHTML = innerHTML;
    }
    return elementToCreate;
}


function scrollToBottom(node) {
    node.scrollTop = node.scrollHeight;
}

init();