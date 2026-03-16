function calculateRebalance(holdings, modelFunds) {

    const totalPortfolio = holdings.reduce(
        (sum, h) => sum + h.current_value,
        0
    );

    const modelMap = {};

    modelFunds.forEach(f => {
        modelMap[f.fund_id] = f;
    });

    let totalBuy = 0;
    let totalSell = 0;

    const items = holdings.map(h => {

        const currentPct = (h.current_value / totalPortfolio) * 100;

        if (modelMap[h.fund_id]) {

            const targetPct = modelMap[h.fund_id].allocation_pct;

            const drift = targetPct - currentPct;

            const amount = Math.abs((drift / 100) * totalPortfolio);

            let action = "HOLD";

            if (drift > 0) {
                action = "BUY";
                totalBuy += amount;
            }

            if (drift < 0) {
                action = "SELL";
                totalSell += amount;
            }

            return {
                fund_id: h.fund_id,
                fund_name: h.fund_name,
                current_pct: currentPct,
                target_pct: targetPct,
                drift,
                action,
                amount: Math.round(amount),
                is_model_fund: 1
            };

        } else {

            return {
                fund_id: h.fund_id,
                fund_name: h.fund_name,
                action: "REVIEW",
                amount: h.current_value,
                is_model_fund: 0
            };
        }

    });

    const freshMoney = totalBuy - totalSell;

    return {
        portfolio_value: totalPortfolio,
        total_buy: Math.round(totalBuy),
        total_sell: Math.round(totalSell),
        fresh_money_needed: Math.round(freshMoney),
        items
    };
}

module.exports = calculateRebalance;