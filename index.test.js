
// index.js unit tests

const { filterQuoteObjs, checkMergeRules, quoteBody } = require('./index');

describe('filterQuoteObjs function unit tests ', () => {
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

    test('should return the expected result', () => {
        expect(filterQuoteObjs(quoteDetails, SFDCObjName)).toEqual(resultfilterQuoteObjs);
    });
    test('should return an empty array if no matches are found', () => {
        expect(filterQuoteObjs([], SFDCObjName)).toEqual([]);
    });
    test('should return an empty array if no matches are found', () => {
        expect(filterQuoteObjs(quoteDetails, "")).toEqual([]);
    });
});

describe('checkMergeRules function unit tests ', () => {
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

    test('should correctly filter items based on merge rules', () => {
        expect(checkMergeRules(allItems, mergeRule, sectionConfig)).toEqual(resultcheckMergeRules);
    });
});

describe('quoteBody function unit tests ', () => {
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

    test('should return the Request Body for PUT API request', () => {
        expect(quoteBody(SFDCObjDetails, quoteConfig, quoteObj)).toEqual(resultQuoteBody);
    });
});

//index.js integration tests
require('dotenv').config();
const { sendRequest } = require('./index');
const mockFetch = require("node-fetch");
jest.mock("node-fetch");


const responseData = {
    "id": "e84ceaab-5077-465f-8921-5a53aee401b9",
    "currency": "USD",
    "total": "120",
    "summary": {
        "total": "120",
        "subtotal": "0",
        "one_time_subtotal": "0",
        "recurring_subtotal": [],
        "total_qty": null,
        "custom_fields": {},
        "discounts": {},
        "fees": {},
        "taxes": {},
        "total_discount": null,
        "total_tax": null,
        "total_fee": null,
        "total_savings": null,
        "total_contract_value": null
    },
    "sections": [
        {
            "id": "700ce57e-f107-4ea7-a5b9-b18c2da57f6c",
            "name": "Section 1",
            "total": "120",
            "summary": {
                "total": "120",
                "subtotal": "0",
                "one_time_subtotal": "0",
                "recurring_subtotal": [],
                "total_qty": null,
                "custom_fields": {},
                "discounts": {},
                "fees": {},
                "taxes": {},
                "total_section_value": null
            },
            "columns": [
                {
                    "header": "Name",
                    "name": "Name",
                    "merge_name": "Name",
                    "hidden": false
                },
                {
                    "header": "Description",
                    "name": "Description",
                    "merge_name": "Description",
                    "hidden": false
                },
                {
                    "header": "Price",
                    "name": "Price",
                    "merge_name": "Price",
                    "hidden": false
                },
                {
                    "header": "Quantity",
                    "name": "Quantity",
                    "merge_name": "Quantity",
                    "hidden": false
                },
                {
                    "header": "Total",
                    "name": "Total",
                    "merge_name": "Total",
                    "hidden": false
                },
                {
                    "header": "SKU",
                    "name": "SKU",
                    "merge_name": "SKU",
                    "hidden": true
                },
                {
                    "header": "Cost",
                    "name": "Cost",
                    "merge_name": "Cost",
                    "hidden": true
                }
            ],
            "items": [
                {
                    "id": "38000b32-2371-4b21-a15e-6d9313a04a13",
                    "sku": "#",
                    "name": "TEST product333",
                    "description": "",
                    "qty": "5",
                    "price": "24",
                    "cost": "0",
                    "billing_frequency": null,
                    "contract_term": null,
                    "pricing_method": "flat",
                    "type": "product",
                    "reference_type": "public-api",
                    "reference_id": "",
                    "options": {
                        "qty_editable": false,
                        "selected": true
                    },
                    "custom_columns": {},
                    "multipliers": {},
                    "discounts": {},
                    "fees": {},
                    "taxes": {},
                    "total": "120",
                    "overall_total": null,
                    "merged_data": {
                        "Name": "TEST product333",
                        "Description": "",
                        "Price": "24",
                        "Quantity": "5",
                        "SKU": "#",
                        "Cost": "0"
                    }
                }
            ],
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
            "id": "cce6e635-7b18-4381-9ef8-c74168a99d4c",
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
                        "type": "contains",
                        "value": "TEST"
                    }
                ]
            }
        }
    ],
    "settings": {
        "selection_type": "custom"
    }
};
mockFetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(responseData)
});

describe('sendRequest Function integration test, request to PandaDoc API', () => {
    const docId = "zDJ4QWhXE6UCNDHDUvHdhd";
    const quoteId = "e84ceaab-5077-465f-8921-5a53aee401b9";
    const pandaDocAuth = process.env.PANDADOC_AUTH;
    const reqBody = {
        "sections": [
            {
                "id": "700ce57e-f107-4ea7-a5b9-b18c2da57f6c",
                "items": [
                    {
                        "name": "TEST product333",
                        "qty": 5,
                        "price": 24
                    }
                ],
                "settings": {
                    "optional": false
                }
            }
        ]
    };


    test('Send PUT request to PandaDoc API', async () => {
        const result = await sendRequest(docId, quoteId, pandaDocAuth, reqBody);

        expect(typeof result.id).toBe('string');
        expect(result).toEqual(responseData);
    })
});


