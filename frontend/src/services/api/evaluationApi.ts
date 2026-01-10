import { apiClient } from './client';
import { API_PATHS } from '../../types';
import type {
  Department,
  EvaluationCriteria,
  VoteRequest,
  VoteResponse,
  ResultsResponse,
  DepartmentDetailResponse,
  HealthResponse,
} from '../../types';

/**
 * 部署一覧を取得
 */
export async function getDepartments(): Promise<Department[]> {
  const response = await apiClient.get<Department[]>(API_PATHS.DEPARTMENTS);
  return response.data;
}

/**
 * 評価項目一覧を取得
 */
export async function getCriteria(): Promise<EvaluationCriteria[]> {
  const response = await apiClient.get<EvaluationCriteria[]>(API_PATHS.CRITERIA);
  return response.data;
}

/**
 * 評価を送信
 */
export async function submitVote(data: VoteRequest): Promise<VoteResponse> {
  const response = await apiClient.post<VoteResponse>(API_PATHS.VOTE, data);
  return response.data;
}

/**
 * 評価結果を取得
 */
export async function getResults(): Promise<ResultsResponse> {
  const response = await apiClient.get<ResultsResponse>(API_PATHS.RESULTS);
  return response.data;
}

/**
 * 部署別詳細結果を取得
 */
export async function getDepartmentDetail(departmentId: string): Promise<DepartmentDetailResponse> {
  const response = await apiClient.get<DepartmentDetailResponse>(
    API_PATHS.RESULTS_DETAIL(departmentId)
  );
  return response.data;
}

/**
 * ヘルスチェック
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>(API_PATHS.HEALTH);
  return response.data;
}
