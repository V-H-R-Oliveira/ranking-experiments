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
}

export default BaseScorer