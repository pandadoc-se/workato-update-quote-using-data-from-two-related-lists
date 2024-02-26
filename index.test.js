
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
        "id": "123",
        "enabled": true,
        "action": {
            "type": "merge_to_section",
            "section_id": "123"
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
        id: '123',
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
                "url": "/services/data/v59.0/sobjects/Custom_Object__c/123"
            },
            "Name": "Object 1",
            "Id": "123",
            "Description__c": null,
            "Price__c": 50,
            "Quantity__c": 2
        },
        {
            "attributes": {
                "type": "Custom_Object__c",
                "url": "/services/data/v59.0/sobjects/Custom_Object__c/123"
            },
            "Name": "TEST Object",
            "Id": "123",
            "Description__c": null,
            "Price__c": 5,
            "Quantity__c": 5
        },
        {
            "attributes": {
                "type": "Custom_Object__c",
                "url": "/services/data/v59.0/sobjects/Custom_Object__c/123"
            },
            "Name": "PRODUCT",
            "Id": "123",
            "Description__c": null,
            "Price__c": 20,
            "Quantity__c": 2
        }
    ];
    const quoteObj = {
        id: 'ab',
        mergeRule: [{
            id: 'a',
            enabled: true,
            action: {
                type: 'merge_to_section',
                section_id: '123'
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
            id: '123',
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
    "id": process.env.QUOTE_ID,
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
            "id": process.env.SECTION_ID,
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
                "section_id": process.env.SECTION_ID
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
                "section_id": process.env.SECTION_ID
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
    const docId = process.env.DOC_ID;
    const quoteId = process.env.QUOTE_ID;
    const pandaDocAuth = process.env.PANDADOC_AUTH;
    const sectionId = process.env.SECTION_ID;
    const reqBody = {
        "sections": [
            {
                "id": sectionId,
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


