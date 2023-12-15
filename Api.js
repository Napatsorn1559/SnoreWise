import axios from "axios";

const API_DOMAIN = "http://Snorewise-env.eba-gqgjifdg.us-east-1.elasticbeanstalk.com"

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

export const requestAudioUri = async (uid, selectDate) => {
  let postDate = ApiDateFormat(selectDate);

  let http = `${API_DOMAIN}/getpredict`;
  let jsonPayload = {
    "user_id": uid,
    'date': postDate
  };

  try {
    const result = await axios.post(http, jsonPayload);
    // console.log(result.data.response);
    if (result.data.response.length > 0) {
      //set data format
      const modelResults = result.data.response.map(item => item.path);
      // console.log(modelResults[0]); //mock up choosing first sound of the day
      // const cleanChartData = modelResults.flat().filter(value => !isNaN(value) && isFinite(value));

      return {
        uri: modelResults[0]
      };
    } else {
      alert('No Data');
      return {
        uri: 'none'
      }
    }
  } catch (error) {
    console.error(" requestAudioUri Error:", error.message);
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
  } catch (error) {
    console.error('Update Alcohol Factor Fail');
  }
}


