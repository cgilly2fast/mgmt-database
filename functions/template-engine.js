const moment = require("moment-timezone");
const BigNumber = require('bignumber.js');
const segmentCodes = require("./segmentCodes");

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
                } else if(this.rule.type === "HOURS" ) {
                    return ""
                } else if(  this.rule.type === "COMMISSION" && this.data.tracking === undefined 
                            || this.rule.type === "CLEANING_FEES_TO_MANAGER" && this.data.tracking === undefined 
                            || this.rule.type === "OWNER_PAYOUT") {
                    return this.data.unit_name
                } else if(this.rule.type === "AMAZON_BILLS") {
                    return this.data[18]
                } else if(this.rule.type === "AMAZON_REFUNDS") {
                    return this.data[36]
                }
                
                return this.data.tracking[0].option
            },
            work_date: () => {
                
                if(this.rule.type === "CLEANING") {
                    return this.data[1]
                } 
                return this.data[2]
            },
            work_description: () => {
                if(this.rule.type === "BILLABLE_EXPENSE") {
                    return this.data.description
                }
                return this.data[1]
            },
            hourly_rate: () => {
                return (parseFloat(this.data[7])*100/parseFloat(this.data[6])*100)/10000
            },
            quantity: () => {
                if(this.rule.type === "CLEANING" || this.rule.type === "COMMISSION" || this.rule.type === "CLEANING_FEES_TO_MANAGER") {
                    return 1
                } else if(this.rule.type === "BILLABLE_EXPENSE") {
                    return this.data.quantity
                }  else if(this.rule.type === "AMAZON_BILLS") {
                    return this.data[14]
                }
                return this.data[6]
            },
            unit_amount: () => {
                if(this.rule.type === "CLEANING") {
                    return parseInt(this.data[3])
                } else if(this.rule.type === "BILLABLE_EXPENSE" || this.rule.type === "COMMISSION" || this.rule.type === "CLEANING_FEES_TO_MANAGER") {
                    return this.data.unitAmount
                } else if(this.rule.type === "AMAZON_BILLS") {
                    return BigNumber(this.data[16]).div(this.data[14]).toString()
                }else if(this.rule.type === "AMAZON_REFUNDS") {
                    return this.data[18]
                }
                return (parseFloat(this.data[7])*100/parseFloat(this.data[6])*100)/10000 
            },
            commission_amount: () => {
                return this.data.commission
                
            },
            mirror_description: () => {
                return this.data.description
            },
            cleanings_revenue: () => {
                return this.data.cleaning_revenue
            },
            mirror_account_code: () => {
                
                const billable_to_codes = {
                    "5551": "5010",
                    "5552": "6000",
                    "5553": "6285",
                    "5554": "6540",
                    "5555": "6320",
                    "5556": "6640",
                    "5559": "8400",
                    "5030": "4200",
                    "4200": "5030",
                    "5010": "4100",
                    "4900": "6640"
                    // "6900": "6640",
                    // "6905": "6640",

                }
                
                return billable_to_codes[this.data.accountCode]
            },
            mirror_contact_name: () => {
                return this.rule.mirror_invoice.contact.name
            },
            end_of_last_month_m: () => {
                return moment().subtract(1,'months').endOf('month').format('MM-YYYY')
            },
            last_month: () => {
                return moment().subtract(1,'months').format('MMMM')
            },
            last_month_year: () => {
                return moment().subtract(1,'months').format('YYYY')
            },
            commission_payout_total: () => {
                return "$"+this.data.payout
            },
            commission_rate: () => {
                return  (this.rule.commission_rate *100) + "%"
            },
            base_account_name: () => {
                return this.rule.account.account
            },
            owner_payout: ()=> {
                return this.data.profit
            },
            amazon_order_number: () =>{
                return this.data[1]
            },
            purchase_order_number: () =>{
                if(this.rule.type === "AMAZON_REFUNDS") {
                    return this.data[3]
                }
                return this.data[2]
            },
            transaction_date: () => {
                return moment(this.data[0]).format("YYYY-MM-DD")
            },
            transaction_date_plus_15: () => {
                return moment(this.data[0]).add(15, "days").format("YYYY-MM-DD")
            }, 
            item_description:() => {
                if(this.rule.type === "AMAZON_REFUNDS") {
                    return this.data[21]
                }
                return this.data[13] +": " +this.data[12]
            },
            purchase_qauntity: () => {
                return  this.data[14]
            },
            channel_option: () =>{
                if(this.rule.type === "AMAZON_REFUNDS") {
                    return this.data[37]
                }
                return this.data[19]
            },
            amazon_account_code: () => {
                let unspsc = this.data[11]
                let unit_name = this.data[18]
                if(this.rule.type === "AMAZON_REFUNDS") {
                    
                    unspsc = this.data[22]
                    unit_name = this.data[36]
                } 
                const billable_unit = this.rule.billable_units[unit_name]
                if (billable_unit) {
                    
                    return billable_unit.account_code;
                }
                
                return segmentCodes[unspsc.substring(0, 2)];
                
            },
            refund_date: () => {
                return moment(this.data[6]).format("YYYY-MM-DD")
            },
            refund_date_plus_15: () => {
                return moment(this.data[6]).add(15,"days").format("YYYY-MM-DD")
            }

        }
    }
    
    

    exec(template, data) {
        if(data !==undefined) {
            this.setData(data)   
        }
        template += ""
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

