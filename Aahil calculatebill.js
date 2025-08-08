/**
 * Task 1: Create a function that returns simplified bill structure with item names
 */
function getSimplifiedBill(bill, items) {
    const itemMap = items.reduce((map, item) => {
        map[item.id] = item;
        return map;
    }, {});

    const transformedBillItems = bill.billItems.map(billItem => {
        const item = itemMap[billItem.id];
        return {
            id: billItem.id,
            name: item.itemName,
            quantity: billItem.quantity
        };
    });

    return {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: transformedBillItems
    };
}

/**
 * Task 2: Create a function that returns detailed bill with calculations
 */
function getDetailedBillWithCalculations(bill, items, categories) {
    const itemMap = items.reduce((map, item) => {
        map[item.id] = item;
        return map;
    }, {});

    const categoryMap = categories.reduce((map, category) => {
        map[category.id] = category;
        return map;
    }, {});

    let totalBillAmount = 0;

    const transformedBillItems = bill.billItems.map(billItem => {
        const item = itemMap[billItem.id];
        const category = categoryMap[item.category.categoryId];
        
        const baseAmount = item.rate * billItem.quantity;
        
        let discountAmount = 0;
        if (billItem.discount) {
            if (billItem.discount.isInPercent === 'Y') {
                discountAmount = (baseAmount * billItem.discount.rate) / 100;
            } else {
                discountAmount = billItem.discount.rate;
            }
        }
        
        const amountAfterDiscount = baseAmount - discountAmount;
        
        let totalTaxAmount = 0;
        item.taxes.forEach(tax => {
            if (tax.isInPercent === 'Y') {
                totalTaxAmount += (amountAfterDiscount * tax.rate) / 100;
            } else {
                totalTaxAmount += tax.rate;
            }
        });
        
        const finalAmount = amountAfterDiscount + totalTaxAmount;
        totalBillAmount += finalAmount;

        return {
            id: billItem.id,
            name: item.itemName,
            quantity: billItem.quantity,
            discount: billItem.discount,
            taxes: item.taxes,
            amount: parseFloat(finalAmount.toFixed(2)),
            superCategoryName: category.superCategory.superCategoryName,
            categoryName: category.categoryName
        };
    });

    return {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: transformedBillItems,
        "Total Amount": parseFloat(totalBillAmount.toFixed(2))
    };
}