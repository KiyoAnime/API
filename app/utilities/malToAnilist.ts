import axios from 'axios';

export default async (malId: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        // prettier-ignore
        axios({
            method: 'POST',
            url: 'https://graphql.anilist.co',
            data: {
                variables: { id: malId },
                query: 'query($id: Int) { Media(idMal: $id) { id } }'
            }
        }).then((res) => resolve(res.data.data.Media.id)).catch(reject);
    });
};
