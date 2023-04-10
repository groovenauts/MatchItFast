import time
import google.cloud.aiplatform_v1beta1 as aiplatform_v1beta1

class MatchingQueryClient:
    def __init__(self, matching_engine_domain, index_endpoint, deployed_index_id):
        client_options = {
                "api_endpoint": matching_engine_domain
                }

        self._client = aiplatform_v1beta1.MatchServiceClient(
                client_options=client_options,
        )
        self._index_endpoint = index_endpoint
        self._deployed_index_id = deployed_index_id

    def query_embedding(self, embedding, num_neighbors=30):
        request = aiplatform_v1beta1.FindNeighborsRequest(
                index_endpoint=self._index_endpoint,
                deployed_index_id=self._deployed_index_id,
                )
        dp1 = aiplatform_v1beta1.IndexDatapoint(
                datapoint_id="0",
                feature_vector=embedding)
        query = aiplatform_v1beta1.FindNeighborsRequest.Query(datapoint=dp1, neighbor_count=num_neighbors)
        request.queries.append(query)
        st = time.time()
        response = self._client.find_neighbors(request)
        ed = time.time()
        return (response.nearest_neighbors[0], ed - st)
