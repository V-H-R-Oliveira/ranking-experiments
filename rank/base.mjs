class BaseScorer {
    constructor(topN) {
        this.topN = topN
    }

    sortResult(response) {
        return [...response.entries()].filter((entry) => entry[1] > 0).sort((a, b) => b[1] - a[1])
    }

    showTopN(response, n = this.topN) {
        return response.slice(0, n)
    }

    fit() {
        throw new Error("Not implemented")
    }

    search(query, strategy) {
        throw new Error("Not implemented")
    }
}

export default BaseScorer