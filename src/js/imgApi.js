import axios from "axios";

export async function imgApi(q, perPage, page){
    const keyApi = "35788548-1e3a4018799afe7de9825494d";
    try {
        const {data} = await axios.get(
            `https://pixabay.com/api/?key=${keyApi}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
          );
          // console.log(data)
        return data;
    } catch (error) {

      // throw new Error(error);
    }
    
}
