import { dummyCorpus } from "./dummy-corpus.mjs"
import { englishBibleCorpus } from "./english-bible-corpus.mjs"
import { BIBLE_CORPUS, DUMMY_CORPUS } from "../utils/constants.mjs"

const corpusMap = new Map()

corpusMap.set(BIBLE_CORPUS, englishBibleCorpus)
corpusMap.set(DUMMY_CORPUS, dummyCorpus)

export { dummyCorpus, englishBibleCorpus, corpusMap }