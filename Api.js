import axios from "axios";

const API_DOMAIN = "http://snorewise.eba-4g3sbjav.us-east-1.elasticbeanstalk.com"

function ApiDateFormat(date) {
  let createDate = new Date(date);
  let year = createDate.getFullYear();
  let month = createDate.getMonth() + 1;
  let day = createDate.getDate();
  let postDate = `${year}-${month}-${day}`;
  return postDate;
}

const calculateHourDuration = (timeStart, timeStop) => {
  const start = new Date(`1970-01-01T${timeStart}`);
  const stop = new Date(`1970-01-01T${timeStop}`);
  const durationInMilliseconds = stop - start;
  const durationInHour = durationInMilliseconds / (1000 * 60 * 60);
  return Math.round(durationInHour);
};

export const getDomain = async () => {
  return API_DOMAIN;
};

export const requestSummaryData = async (uid, selectDate) => {

  let postDate = ApiDateFormat(selectDate);

  const http = `${API_DOMAIN}/get-daily?user_id=${uid}&date=${postDate}`;

  try {
    const result = await axios.get(http);
    // console.log(result.data.response.Error);
    if (result.data.response.Error) {
      return {
        snoring: 0,
        non_snoring: 0,
        sleep_time: 0,
        intensity: '0'
      };
    } else {
      return result.data.response;
    }
  } catch (error) {
    console.error("Api.js: requestSummaryData fail:", error.message);
  }
};

export const requestProfileData = async (uid) => {
  const http = `${API_DOMAIN}/getuser`;
  let jsonPayload = {
    'user_id': uid,
  };

  try {
    const response = await axios.post(http, jsonPayload);
    return response.data;

  } catch (error) {
    console.error("Error fetching Profile data:", error.message);
  }
}

export const requestLogin = async (username, password) => {
  const http = `${API_DOMAIN}/login`;
  let jsonPayload = {
    'username': username,
    'password': password
  };
  try {
    const result = await axios.post(http, jsonPayload);
    console.log("Login successful");
    return {
      result: 'success',
      userId: result.data.user_id,
      username: result.data.username
    }

  } catch (error) {
    // console.error("requestLogin fail:", error.message);
    return {
      result: 'fail',
      userId: 999,
      username: 'none'
    }
  }
}

export const requestAudioUri = async (uid, start, end, type) => {
  let postStart = ApiDateFormat(start);
  let postEnd = ApiDateFormat(end);
  let endpoint;

  if (type == 'sound') {
    endpoint = 'request-sound';
    let http = `${API_DOMAIN}/${endpoint}?user_id=${uid}&start_date=${postStart}&end_date=${postEnd}`;
    console.log(http);
    try {
      const result = await axios.get(http);
      console.log('audio uri result', result.data.response);
      if (result.data.response) {
        return {
          uri: result.data.response
        };
      } else {
        alert('No Data');
      }
    } catch (error) {
      console.error(" requestAudioUri Error:", error.message);
    }
  } else {
    endpoint = 'pdf';
    let http = `${API_DOMAIN}/${endpoint}?user_id=${uid}&start_date=${postStart}&end_date=${postEnd}`;
    console.log(http);
    try {
      return {
        uri: http
      };
    } catch (error) {
      console.error(" requestAudioUri (pdf) Error:", error.message);
    }

  }

}

export const updateFactor = async (uid, selectDate, factorName, factorResult) => {
  let postDate = ApiDateFormat(selectDate);
  let http = `${API_DOMAIN}/update-factor`;

  switch (factorName) {
    case 'alcohol':
      jsonPayload = {
        'user_id': uid,
        'date': postDate,
        'alcohol': factorResult
      }
      break;
    case 'stress':
      jsonPayload = {
        'user_id': uid,
        'date': postDate,
        'stress': factorResult
      }
      break;
    case 'exercise':
      jsonPayload = {
        'user_id': uid,
        'date': postDate,
        'exercise': factorResult
      }
    default:
      break;
  }

  try {
    const result = await axios.put(http, jsonPayload);
    // console.log(result.data);
    if (result.data.error) {
      alert('invalid date: the selected date have no record')
    }
  } catch (error) {
    console.error(`Update Factor Error: ${error}`);
  }
}

export const requestNotification = async (uid) => {
  let http = `${API_DOMAIN}/notify/${uid}`;

  const result = await axios.post(http);
  // console.log('api page',result.data);
  return result.data;
}

export const reformatDate = (date) => {
  return ApiDateFormat(date)
}
