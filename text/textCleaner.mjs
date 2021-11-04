import { stopwords } from "./stopwords.mjs"

class CorpusProcessor {
    constructor() {
        this.stopwords = stopwords
    }

    #cleanCorpus(corpus) {
        const corpusWithoutPunctuation = corpus.map((line) => line.trim().replace(/\p{P}/gum, "").toLowerCase())
        return this.#filterStopWords(corpusWithoutPunctuation)
    }

    #filterStopWords(corpus) {
        return corpus.map((line) => {
            const splitedLine = line.split(" ")
            return splitedLine.filter((term) => !this.stopwords.includes(term)).join(" ")
        })
    }

    cleanAndTokenize(corpus) {
        const cleanCorpus = this.#cleanCorpus(corpus)
        return cleanCorpus.map((line) => line.split(" "))
    }
}

export default CorpusProcessor