import os
import pickle

import faiss

from sentence_transformers import SentenceTransformer


INDEX_DIR = "app/faiss_index"


model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


index = faiss.read_index(

    os.path.join(

        INDEX_DIR,

        "knowledge.index"

    )

)


with open(

    os.path.join(

        INDEX_DIR,

        "chunks.pkl"

    ),

    "rb"

) as f:

    documents = pickle.load(f)


def retrieve_context(

    query: str,

    top_k: int = 3

):

    embedding = model.encode(

        [query],

        convert_to_numpy=True

    )

    distances, indices = index.search(

        embedding,

        top_k

    )

    retrieved = []

    for idx in indices[0]:

        if idx != -1:

            retrieved.append(

                documents[idx]

            )

    return "\n\n".join(

        retrieved

    )