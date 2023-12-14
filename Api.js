import  axios  from "axios";

const API_DOMAIN = "http://Snorewise-mobile-env.eba-chmvh2mv.us-east-1.elasticbeanstalk.com"

function ApiDateFormat(date){
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
    const durationInHour = durationInMilliseconds / (1000 * 60 *60);
    return Math.round(durationInHour);
  };

export const fetchHomeSummaryData = async (uid, selectDate) => {

    let postDate = ApiDateFormat(selectDate);

    const http = `${API_DOMAIN}/getpredict`;
    let jsonPayload = {
      'user_id': uid,
      'date': postDate
    };
    
    try {
      const response = await axios.post(http, jsonPayload);
      console.log('data length :',response.data.response.length);
      if (response.data.response.length > 0) {
        const sumcall = response.data.response?.reduce((total, item) => total + (item.calls || 0), 0) || 0;
        const firstStartTime = response.data.response[0]?.time_start;
        const lastStopTime =response.data.response[response.data.response.length - 1]?.time_stop;
        const Hour = calculateHourDuration(firstStartTime, lastStopTime);
        return {
            totalcall: sumcall ,
            totalsleep: Hour,
          };
      }else {
        return {
            totalcall: 0,
            totalsleep:  0,
          };
      }
    } catch (error) {
      console.error("Error fetching HomeSummary Data:", error.message);
    }
};

export const fetchProfileData = async(uid) => {
    const http = `${API_DOMAIN}/getuser`;
    let jsonPayload = {
        'user_id': uid,
    };

    try {
        const response = await axios.post(http, jsonPayload);
       
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}