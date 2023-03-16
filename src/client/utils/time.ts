// var date = new Date(2017, 11, 31, 23, 59, 59);
export const format = new Intl.DateTimeFormat(
    locale(),
    {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }
)

new Date().toISOString().substring(11, 16) // time
new Date().toISOString().substring(0, 10) // date

export const current = {
    time: (options?: Intl.DateTimeFormatOptions) => {
        options = { hour: 'numeric', minute: 'numeric' }
        return new Date().toLocaleTimeString('ru', options)
    },
    date: (options?: Intl.DateTimeFormatOptions) => {
        options = { year: 'numeric', month: '2-digit', day: 'numeric' }
        const date = new Date().toLocaleDateString('ru', options)
        return date.split('.').reverse().join('-')
    }
}

export function date(time: number) {
    return new Date(time).toLocaleString("ru");
}

function locale() {
    return (navigator.languages && navigator.languages.length)
        ? navigator.languages[0] : navigator.language;
}

// console.log(format.format(date))