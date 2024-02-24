
// index.js unit tests

const { filterQuoteObjs, checkMergeRules, quoteBody } = require('./index');


describe('index.js tests ', () => {

    //filterQuoteObjs Tests
    const SFDCObjName = "Custom_Object__c";
    const quoteDetails = [
        {
            "id": "a16608bc-9edf-49a3-a155-e1b71629ff79",
            "sections": [
                {
                    "id": "700ce57e-f107-4ea7-a5b9-b18c2da57f6c",
                    "name": "Section 1",
                    "items": [],
                    "total": "0",
                    "settings": {
                        "selection_type": "custom",
                        "optional": false,
                        "selected": true
                    }
                }
            ],
            "merge_rules": [
                {
                    "id": "2162157a-a5fb-472b-b5f6-e55cfe8b90f6",
                    "enabled": true,
                    "action": {
                        "type": "merge_to_section",
                        "section_id": "700ce57e-f107-4ea7-a5b9-b18c2da57f6c"
                    },
                    "condition": {
                        "field_name": "Object",
                        "type": "contains_field",
                        "comparison": [
                            {
                                "type": "contains",
                                "value": "Custom_Object__c"
                            }
                        ]
                    }
                },
                {
                    "id": "bdb8272c-97cd-4977-9ae9-d14d9c259eac",
                    "enabled": true,
                    "action": {
                        "type": "merge_to_section",
                        "section_id": "700ce57e-f107-4ea7-a5b9-b18c2da57f6c"
                    },
                    "condition": {
                        "field_name": "name",
                        "type": "contains_field",
                        "comparison": [
                            {
                                "type": "does_not_contain",
                                "value": "PRODUCT"
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": "66cf3f65-9fbd-438f-acc1-fff6f10e751c",
            "sections": [
                {
                    "id": "e54b544d-e2ed-4202-8c06-9386cf08e6f3",
                    "name": "Section name",
                    "items": [],
                    "total": "10",
                    "settings": {
                        "selection_type": "custom",
                        "optional": false,
                        "selected": true
                    }
                }
            ],
            "merge_rules": [
                {
                    "id": "75016783-e2d6-4722-ad74-30aae8c19e1f",
                    "enabled": true,
                    "action": {
                        "type": "merge_to_section",
                        "section_id": "e54b544d-e2ed-4202-8c06-9386cf08e6f3"
                    },
                    "condition": {
                        "field_name": "name",
                        "type": "contains_field",
                        "comparison": [
                            {
                                "type": "does_not_contain",
                                "value": "product"
                            }
                        ]
                    }
                }
            ]
        }
    ];
    const resultfilterQuoteObjs = [{
        id: 'a16608bc-9edf-49a3-a155-e1b71629ff79',
        mergeRule: [{
            id: 'bdb8272c-97cd-4977-9ae9-d14d9c259eac',
            enabled: true,
            action: {
                type: 'merge_to_section',
                section_id: '700ce57e-f107-4ea7-a5b9-b18c2da57f6c'
            },
            condition: {
                field_name: 'name',
                type: 'contains_field',
                comparison: [{
                    type: 'does_not_contain',
                    value: 'PRODUCT'
                }]
            }
        }]
    }];

    it('should return the expected result', () => {
        expect(filterQuoteObjs(quoteDetails, SFDCObjName)).toEqual(resultfilterQuoteObjs);
    });
    it('should return an empty array if no matches are found', () => {
        expect(filterQuoteObjs([], SFDCObjName)).toEqual([]);
    });
    it('should return an empty array if no matches are found', () => {
        expect(filterQuoteObjs(quoteDetails, "")).toEqual([]);
    });

    // checkMergeRules Tests
    const sectionConfig = {
        quoteSectionName: "Section Title",
        SFDC_ObjectValues: {
            price: "Price__c",
            name: "Name",
            qty: "Quantity__c"
        },
        quoteSettings: {
            "optional": false
        }
    };
    const allItems = [{
            price: 50,
            name: 'Object 1',
            qty: 2
        },
        {
            price: 5,
            name: 'TEST Object',
            qty: 5
        },
        {
            price: 20,
            name: 'PRODUCT',
            qty: 2
        }
    ];
    const mergeRule = [{
        "id": "cce6e635-7b18-4381-9ef8-c74168a99d4c",
        "enabled": true,
        "action": {
            "type": "merge_to_section",
            "section_id": "700ce57e-f107-4ea7-a5b9-b18c2da57f6c"
        },
        "condition": {
            "field_name": "name",
            "type": "contains_field",
            "comparison": [{
                "type": "does_not_contain",
                "value": "TEST"
            }]
        }
    }];
    const resultcheckMergeRules = [{
        id: '700ce57e-f107-4ea7-a5b9-b18c2da57f6c',
        items: [
          { price: 50, name: 'Object 1', qty: 2 },
          { price: 20, name: 'PRODUCT', qty: 2 }
        ],
        settings: { optional: false }
      }]

    it('should correctly filter items based on merge rules', () => {
        expect(checkMergeRules(allItems, mergeRule, sectionConfig)).toEqual(resultcheckMergeRules);
    });

    // quoteBody Tests
    const quoteConfig = [{
        quoteSectionName: "Section Title",
        SFDC_ObjectValues: {
            price: "Price__c",
            name: "Name",
            qty: "Quantity__c"
        },
        quoteSettings: {
            "optional": false
        }
    }];
    const SFDCObjDetails = [{
            "attributes": {
                "type": "Custom_Object__c",
                "url": "/services/data/v59.0/sobjects/Custom_Object__c/a090900000Mq9MdAAJ"
            },
            "CreatedById": "00509000007SktlAAC",
            "CreatedDate": "2024-02-20T17:24:33.000000+00:00",
            "Name": "Object 1",
            "IsDeleted": false,
            "LastModifiedById": "00509000007SktlAAC",
            "LastModifiedDate": "2024-02-20T17:24:33.000000+00:00",
            "OwnerId": "00509000007SktlAAC",
            "Id": "a090900000Mq9MdAAJ",
            "SystemModstamp": "2024-02-20T17:24:33.000000+00:00",
            "Description__c": null,
            "Price__c": 50,
            "Quantity__c": 2,
            "Opportunity__c": "0060900000WSI4jAAH",
            "Related_Product__c": null,
            "CombinedAttachments": null
        },
        {
            "attributes": {
                "type": "Custom_Object__c",
                "url": "/services/data/v59.0/sobjects/Custom_Object__c/a090900000Mq9bTAAR"
            },
            "CreatedById": "00509000007SktlAAC",
            "CreatedDate": "2024-02-22T13:25:55.000000+00:00",
            "Name": "TEST Object",
            "IsDeleted": false,
            "LastModifiedById": "00509000007SktlAAC",
            "LastModifiedDate": "2024-02-22T13:25:55.000000+00:00",
            "OwnerId": "00509000007SktlAAC",
            "Id": "a090900000Mq9bTAAR",
            "SystemModstamp": "2024-02-22T13:25:55.000000+00:00",
            "Description__c": null,
            "Price__c": 5,
            "Quantity__c": 5,
            "Opportunity__c": "0060900000WSI4jAAH",
            "Related_Product__c": null,
            "CombinedAttachments": null
        },
        {
            "attributes": {
                "type": "Custom_Object__c",
                "url": "/services/data/v59.0/sobjects/Custom_Object__c/a090900000Mq9deAAB"
            },
            "CreatedById": "00509000007SktlAAC",
            "CreatedDate": "2024-02-22T18:10:52.000000+00:00",
            "Name": "PRODUCT",
            "IsDeleted": false,
            "LastModifiedById": "00509000007SktlAAC",
            "LastModifiedDate": "2024-02-22T18:10:52.000000+00:00",
            "OwnerId": "00509000007SktlAAC",
            "Id": "a090900000Mq9deAAB",
            "SystemModstamp": "2024-02-22T18:10:52.000000+00:00",
            "Description__c": null,
            "Price__c": 20,
            "Quantity__c": 2,
            "Opportunity__c": "0060900000WSI4jAAH",
            "Related_Product__c": null,
            "CombinedAttachments": null
        }
    ];
    const quoteObj = {
        id: 'a16608bc-9edf-49a3-a155-e1b71629ff79',
        mergeRule: [{
            id: 'bdb8272c-97cd-4977-9ae9-d14d9c259eac',
            enabled: true,
            action: {
                type: 'merge_to_section',
                section_id: '700ce57e-f107-4ea7-a5b9-b18c2da57f6c'
            },
            condition: {
                field_name: 'name',
                type: 'contains_field',
                comparison: [{
                    type: 'does_not_contain',
                    value: 'PRODUCT'
                }]
            }
        }]
    };
    const resultQuoteBody = {
        sections: [{
            id: '700ce57e-f107-4ea7-a5b9-b18c2da57f6c',
            items: [{
                    price: 50,
                    name: 'Object 1',
                    qty: 2
                },
                {
                    price: 5,
                    name: 'TEST Object',
                    qty: 5
                }
            ],
            settings: {
                optional: false
            }
        }]
    }

    it('should return the Request Body for PUT API request', () => {
        expect(quoteBody(SFDCObjDetails, quoteConfig, quoteObj)).toEqual(resultQuoteBody);
    });
});



