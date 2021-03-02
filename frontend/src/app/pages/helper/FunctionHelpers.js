export function getCurrentDate(separator='-'){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}

export function getFormattedDate(){
    let separator = '-'
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let selectedLang = (JSON.parse(localStorage.getItem('i18nConfig')).selectedLang)
		if(selectedLang === 'pt'){
            return `${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
		}else{
            return `${month<10?`0${month}`:`${month}`}${separator}${date}${separator}${year}`
		}
}

export function getDate(date){
    let timestamp = Date.parse(date);
    let selectedLang = (JSON.parse(localStorage.getItem('i18nConfig'))?.selectedLang)
      let data = new Date();
      if(isNaN(timestamp) == false)
        data = new Date(timestamp);
      const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "numeric",
        day: "2-digit",
      });
      const [
        { value: month },
        ,
        { value: day },
        ,
        { value: year },
      ] = dateTimeFormat.formatToParts(data);
    if(selectedLang === 'pt'){
        return `${day}/${month}/${year}`
    }else{
        return `${month}/${day}/${year}`
    }
  }