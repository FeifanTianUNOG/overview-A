// 设置基本参数
const datasetId = 1;  // overview-meeting 数据集ID为1
let accessToken = '';  // 存储动态获取的 Access Token
let intervalId;

// 获取 Access Token
async function getAccessToken() {
    const clientId = 'b697da9dede74a1b90bd12e048c55b80b5a7e564';
    const clientSecret = '43fbb6d1580ad834e1d427e8a51d6bf9ba86ac7bfc4960f7b7cd8e34a8d9d57952ec47615ddad4aef9c81ca10725655897e2471c1da44be5f8705c78dfddef22a70771b824739ba80662d28e26248f6e29346a89f42bcbd573083a6297fbc0083d44f60396e1c7fb1e2b0faea1eb0bfc85ec233de9fce48233ec0e855da0ef';

    const response = await fetch('https://glacial-sands-72080-04219ba46fd2.herokuapp.com/https://feifantest.xibo.co.uk/api/authorize/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        })
    });

    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
}

// 获取会议数据
async function fetchDatasetData() {
    const filterCondition = `building = 'A' AND LPAD(endTime, 5, '0') > TIME(NOW())`;
    // const filterCondition = `building = 'A' AND LPAD(endTime, 5, '0') > '10:00:00'`; // 筛选Building A的数据
    const response = await fetch(`https://glacial-sands-72080-04219ba46fd2.herokuapp.com/https://feifantest.xibo.co.uk/api/dataset/data/${datasetId}?filter=${encodeURIComponent(filterCondition)}&start=0&length=5`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();
    return data;
}

// 渲染会议信息
async function displayMeetings(data) {
    const meetingContainer = document.getElementById('meeting-container');
    meetingContainer.style.opacity = 0;
    meetingContainer.innerHTML = ''; 

    let allMeetingsHTML = '';

    for (const item of data) {
        const meetingItem = `
            <div class="meeting-wrapper">
                <div class="start-time">${item.startTime}</div>
                <div class="meeting-item">
                    <div class="info">
                        <div class="title">${item.organAcronym}</div>
                        <div class="subtitle">${item.shortTitle}</div>
                    </div>
                    <div class="room">
                        <div class="room-text">${item.room}</div>
                        <div class="floor-text">Salle/Room</div> <!-- 保留了这个字段 -->
                    </div>
                    <div class="floor">
                        <div class="room-text">Niveau3</div>
                        <div class="floor-text">Étage/Floor</div>
                    </div>
                </div>
            </div>
        `;
        allMeetingsHTML += meetingItem;
    }

    meetingContainer.insertAdjacentHTML('beforeend', allMeetingsHTML);
    setTimeout(() => {
        meetingContainer.style.opacity = 1;
    }, 50);
}

// 初始化数据
getAccessToken().then(() => {
    fetchDatasetData().then(data => {
        displayMeetings(data); // 显示前5条数据
    });
});
