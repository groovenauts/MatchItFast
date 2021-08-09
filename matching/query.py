import time
import grpc
import matching.match_service_pb2 as match_service_pb2
import matching.match_service_pb2_grpc as match_service_pb2_grpc

class MatchingQueryClient:
    def __init__(self, matching_engine_service_ip, deployed_index_id):
        self._ip_addr = matching_engine_service_ip
        channel = grpc.insecure_channel("{}:10000".format(self._ip_addr))
        self._stub = match_service_pb2_grpc.MatchServiceStub(channel)
        self._deployed_index_id = deployed_index_id

    def query_embedding(self, embedding, num_neighbors=30):
        request = match_service_pb2.MatchRequest()
        request.deployed_index_id = self._deployed_index_id
        for v in embedding:
            request.float_val.append(v)
        request.num_neighbors = num_neighbors

        st = time.time()
        response = self._stub.Match(request)
        ed = time.time()
        return (response, ed - st)
