const fetch = require("node-fetch");

/**
 * Main function to process PandaDoc documents and send requests.
 *
 * @param {Object} params - Parameters object.
 * @param {string} params.pandaDocAuth - PandaDoc authentication token.
 * @param {Object[]} params.SFDCObjDetails - Details of associated Salesforce custom objects.
 * @param {Object} params.docDetails - Details of the document to process.
 * @param {string} params.SFDCObjName - Name of the Salesforce custom object.
 * @param {Object} params.quoteConfig - Configuration for quotes.
 * @returns {Promise<void>} - Promise representing the main process completion.
 */
exports.main = async ({ pandaDocAuth, SFDCObjDetails, docDetails, SFDCObjName, quoteConfig }) => {

    //Ensure that there are custom objects that have been associated to the SF record
    if (!SFDCObjDetails.length) return 

    const docId = docDetails.id;
    const quoteDetails = docDetails.pricing.quotes;

    const filteredQuotes = filterQuoteObjs(quoteDetails, SFDCObjName);


    if (filteredQuotes.length) {
        for (const quoteObj of filteredQuotes) {

            const reqBody = quoteBody(SFDCObjDetails, quoteConfig, quoteObj);
            await sendRequest(docId, quoteObj.id, pandaDocAuth, reqBody)
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    } else {
        console.log("No Quote's with the correct Merge Rules")
    }
};

/**
 * Filter array of quotes based on any merge rule equalling the specified Salesforce object name.
 * If true, returns an object of the quote ID and the merge_rules array 
 *
 * @param {Object[]} quoteDetails - Details of quotes to filter.
 * @param {string} SFDCObjName - Name of the Salesforce custom object.
 * @returns {Object[]} - Filtered quote objects.
 */
const filterQuoteObjs = (quoteDetails, SFDCObjName) => {
    const filteredQuotes = quoteDetails.filter(quote => {
        return quote.merge_rules && quote.merge_rules.some(rule => {
            return rule.condition && rule.condition.comparison.some(comparison => {
                return comparison.value === SFDCObjName;
            });
        });
    }).map(quote => {
        const mergeRule = quote.merge_rules.filter(rule => {
            return rule.condition.comparison.some(comparison => {
                return comparison.value !== "Custom_Object__c";
            });
        });
        return {
            id: quote.id,
            mergeRule
        }
    });

    return filteredQuotes
};

/**
 * Generates the request body for sending to PandaDoc.
 *
 * @param {Object[]} SFDCObjDetails - Details of associated Salesforce custom objects.
 * @param {Object[]} quoteConfig - Configuration for quotes.
 * @param {Object} quoteObj - Quote object to generate body for.
 * @returns {Object} - Request body.
 */
const quoteBody = (SFDCObjDetails, quoteConfig, quoteObj) => {
    const sections = [];
    let reqBody;

    quoteConfig.forEach(sectionConfig => {
        const items = SFDCObjDetails.map(object => {
            const result = {};

            for (const key in sectionConfig.SFDC_ObjectValues) {
                const sfdcKey = sectionConfig.SFDC_ObjectValues[key];
                result[key] = object[sfdcKey];
            }
            return result
        });

        if (quoteObj.mergeRule.length && items.length) {
            const filteredItems = checkMergeRules(items, quoteObj.mergeRule, sectionConfig);
            reqBody = {
                sections: filteredItems
            };
        } else {
            sections.push({
                ...(sectionConfig.quoteSectionName && { name: sectionConfig.quoteSectionName }),
                items,
                "settings": sectionConfig.quoteSettings
            });
            reqBody = {
                sections
            };
        }        
    });

    return reqBody;
};

/**
 * Checks merge rules for filtering items.
 *
 * @param {Object[]} allItems - All items to check against merge rules.
 * @param {Object[]} mergeRule - Merge rules to apply.
 * @param {Object} sectionConfig - Configuration for quote sections.
 * @returns {Object[]} - Filtered items.
 */
const checkMergeRules = (allItems, mergeRule, sectionConfig) => {

    const filteredItems = [];
    const comparisonFunctions = {
        "contains": (fieldValue, value) => fieldValue.includes(value),
        "equals": (fieldValue, value) => fieldValue === value,
        "does_not_equal": (fieldValue, value) => fieldValue !== value,
        "does_not_contain": (fieldValue, value) => !fieldValue.includes(value)
    };

    for (const item of allItems) {
        let itemSatisfiesRule = false;
        const matchedItems = [];
        let ruleMatched = null;
        
        for (const rule of mergeRule) {
            const { field_name, comparison } = rule.condition;

            if (Object.keys(item).includes(field_name)) {
                const fieldValue = item[field_name];
                const conditionsSatisfied = comparison.every(comp => {
                    const comparisonFunction = comparisonFunctions[comp.type];
                    return comparisonFunction(fieldValue, comp.value);
                });

                if (conditionsSatisfied) {
                    matchedItems.push(item);
                    itemSatisfiesRule = true;
                    ruleMatched = rule;
                }
            }
        }

        // If the item satisfies rule, push section_id and matchedItems to filteredItems array
        if (itemSatisfiesRule && ruleMatched) {
            const existingItemIndex = filteredItems.findIndex(obj => obj.id === ruleMatched.action.section_id);
            if (existingItemIndex !== -1) {
                filteredItems[existingItemIndex].items.push(...matchedItems);
            } else {
                filteredItems.push({
                    id: ruleMatched.action.section_id,
                    items: matchedItems,
                    "settings": sectionConfig.quoteSettings
                });
            }
        }
    }

    return filteredItems;
};

/**
 * Sends a request to Update Quote endpoint.
 *
 * @param {string} docId - ID of the document.
 * @param {string} quoteId - ID of the quote.
 * @param {string} pandaDocAuth - PandaDoc authentication either API-Key {key} or Bearer {token}.
 * @param {Object} reqBody - Request body to send.
 * @returns {Promise<void>} - Promise representing the completion of the request.
 */
const sendRequest = async (docId, quoteId, pandaDocAuth, reqBody) => {
    const url = `https://api.pandadoc.com/public/v1/documents/${docId}/quotes/${quoteId}`;
    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': pandaDocAuth
        },
        body: JSON.stringify(reqBody),
    })
};

module.exports = {
    filterQuoteObjs,
    checkMergeRules,
    quoteBody
};