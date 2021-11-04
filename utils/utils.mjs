const getTermsFrequencyMap = (corpus) => {
    const frequencyMap = new Map()

    for (const term of corpus) {
        if (frequencyMap.has(term)) {
            const frequency = frequencyMap.get(term)
            frequencyMap.set(term, frequency + 1)
        } else {
            frequencyMap.set(term, 1)
        }
    }

    return frequencyMap
}

const getArraySum = (array) => array.reduce((previous, current) => previous + current, 0)

const getTokenizedQuery = (corpusCleaner, query) => {
    const queryArray = [query]
    return corpusCleaner.cleanAndTokenize(queryArray).flat()
}

export { getTermsFrequencyMap, getArraySum, getTokenizedQuery }