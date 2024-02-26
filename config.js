
//Each object in the quoteConfig array represents a new Section in the Quote. 
//If you just have one section please delete the second object, if more than two add corresponding number.

const quoteConfig = [{
    quoteSectionName: "Section Title", //OPTIONAL, leave as empty string if there is no section name 
    SFDC_ObjectValues: {
        //Keys must equal the quote's section's item's field name: reference https://developers.pandadoc.com/docs/update-quotes
        //Values equal SFDC_Object's field API Name.
        price: "Price__c", //Example values
        name: "Name",
        qty: "Quantity__c"
        //Continue adding key value pairs as appropriate
    },
    quoteSettings: {
        "optional": false // Default to false, change to true if line item is selectable
    }
},
{
    quoteSectionName: "",
    SFDC_ObjectValues: {
        price: "",
        name: "",
        qty: ""
    },
    quoteSettings: {
        "optional": false
    }
}
//...
];


/*

THINGS IT DOES
- Retrieves every quote in a document which has a merge rule that Object = The SF Object's Name.
- Updates these quotes with row data pulled from the second Salesforce Related Object.


*/
