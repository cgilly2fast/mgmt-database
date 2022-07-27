const moment = require("moment-timezone");

module.exports = class TemplateEngine{
    constructor(rule) {
        this.rule = rule;
        this.data = {};
        
        this.output = {
            contact_name: () => {
                return this.rule.invoice.contact.name
            },
            day_of_execution: () => {
                return moment().format("YYYY-MM-DD")
            } ,
            end_of_last_month : () => {
                return moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD')
            },
            day_of_execution_plus_15: () => {
                return moment().add(15,"days").format("YYYY-MM-DD")
            } ,
            end_of_last_month_plus_15 : () => {
                return moment().subtract(1,'months').endOf('month').add(15,"days").format('YYYY-MM-DD')
            },
            unit_name: () => {
                if(this.rule.type === "CLEANING") {
                    return this.data[2]
                } 
                return this.data.tracking[0].name
            },
            work_date: () => {
                
                if(this.rule.type === "CLEANING") {
                    return this.data[1]
                } 
                return this.data[2]
            },
            work_description: () => {
                return this.data[1]
            },
            hourly_rate: () => {
                console.log(this.data)
                return (parseFloat(this.data[7])*100/parseFloat(this.data[6])*100)/10000
            },
            quantity: () => {
                if(this.rule.type === "CLEANING") {
                    return 1
                } 
                return this.data[6]
            },
            unit_amount: () => {
                if(this.rule.type === "CLEANING") {
                    return parseInt(this.data[3])
                }
                return (parseFloat(this.data[7])*100/parseFloat(this.data[6])*100)/10000 
            }
        }
    }
    
    

    exec(template, data) {
        if(data !==undefined) {
            this.setData(data)   
        }
        const flags = template.match(/<%(.*?)%>/gm)
        const split = template.split(/<%(.*?)%>/gm)
        // console.log(flags[0].substring(2,flags[0].length -2))
        
        const outputFlags = []
        if(flags !== null) {
            for(let i = 0; i < flags.length; i++) {
                let flag = flags[i].substring(2,flags[i].length -2)
                outputFlags[flag] = this.output[flag]()
            } 
        
            for(let i = 0; i < split.length; i++) {
                if(outputFlags[split[i]] !== undefined) {
                    split[i] = outputFlags[split[i]]
                }
            }
            
            return split.join('') 
        } 
        
        return template      
        
        
    }

    setData(data) {
        this.data = data
    }

    
}

