import BaseScorer from "./base.mjs"
import { getTermsFrequencyMap, getArraySum } from "../utils/utils.mjs"

class BM25 extends BaseScorer {
    constructor(corpus, k1 = 1.2, b = 0.75, topN = 5) {
        super(topN)
        this.corpus = corpus
        this.corpusLength = corpus.length
        this.corpusDataMap = new Map()
        this.k1 = k1
        this.b = b
        this.avgWordsPerDocument = 0
    }

    #idf(term) {
        const totalDocumentsThatContainsTerm = [...this.corpusDataMap.values()]
            .map((value) => value.frequencyMap)
            .filter((freqMap) => freqMap.has(term)).length
        const idf = (this.corpusLength - totalDocumentsThatContainsTerm + 0.5) / (totalDocumentsThatContainsTerm + 0.5)
        return Math.log(1 + idf)
    }

    #bm25(term, documentIdx) {
        const documentData = this.corpusDataMap.get(documentIdx)
        const termFreq = documentData.frequencyMap.get(term) ?? 0
        const documentTotalWords = documentData.totalWords
        const numerator = termFreq * (this.k1 + 1)
        const denominator = termFreq + this.k1 * (1 - this.b + this.b * (documentTotalWords / this.avgWordsPerDocument))

        return numerator / denominator
    }

    #score(term, documentIdx) {
        return this.#idf(term) * this.#bm25(term, documentIdx)
    }

    fit() {
        let words = 0, documentsLength = 0

        for (const documentIdx in this.corpus) {
            const document = this.corpus[documentIdx]
            const frequencyMap = getTermsFrequencyMap(document)
            const totalWords = getArraySum([...frequencyMap.values()])

            const documentData = {
                frequencyMap,
                totalWords
            }

            this.corpusDataMap.set(documentIdx, documentData)
            documentsLength += document.length
            words += totalWords
        }

        this.avgWordsPerDocument = words / documentsLength
    }

    search(query) {
        const responseMap = new Map()

        for (const documentIdx in this.corpus) {
            const documentFrequencyMap = this.corpusDataMap.get(documentIdx).frequencyMap
            const filteredTerms = query.filter((term) => documentFrequencyMap.has(term))
            const allTermsScores = filteredTerms.map((term) => this.#score(term, documentIdx))
            const finalScore = getArraySum(allTermsScores)
            responseMap.set(documentIdx, finalScore)
        }

        const sortedResult = this.sortResult(responseMap)
        return this.showTopN(sortedResult)
    }
}

export default BM25