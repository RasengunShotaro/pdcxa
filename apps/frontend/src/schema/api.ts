import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  CreateGifPd201,
  CreateGifPd404,
  CreateGifPdBody,
  CreateInvitation200,
  CreateInvitationBody,
  CreatePd201,
  CreatePd404,
  CreatePdBody,
  CreateRePd201,
  CreateRePdBody,
  FetchBookmarkedPds200,
  FetchBookmarkedPdsParams,
  FetchNotificationUnreadCount200,
  FetchNotifications200,
  FetchNotificationsParams,
  FetchPds200,
  FetchPdsParams,
  FetchRePds200Item,
  FetchRePdsParams,
  FetchUserDetail200,
  FetchUserDetailParams,
  FetchUserDetails200Item,
  FetchUserDetailsParams,
  FetchWeeklyStats200,
  MarkNotificationsSeen200,
  MutatePdBookmark200,
  MutatePdBookmarkBody,
  MutatePdLike201,
  MutatePdLikeBody,
  MutateRePdLike201,
  MutateRePdLikeBody
} from './models';

import { orvalFetch } from '../lib/orval-fetcher';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



const withQueryKey = <T extends object, K>(query: T, queryKey: K): T & { queryKey: K } => {
  const result = { queryKey } as T & { queryKey: K };
  for (const key of Object.keys(query)) {
    // The explicit queryKey always wins, matching the previous
    // `{ ...query, queryKey }` spread where it was set last.
    if (key === 'queryKey') continue;
    Object.defineProperty(result, key, {
      enumerable: true,
      configurable: true,
      get: () => (query as Record<string, unknown>)[key],
    });
  }
  return result;
};

export type createInvitationResponse200 = {
  data: CreateInvitation200
  status: 200
}

export type createInvitationResponseSuccess = (createInvitationResponse200) & {
  headers: Headers;
};
;

export type createInvitationResponse = (createInvitationResponseSuccess)

export const getCreateInvitationUrl = () => {




  return `/invitation/create`
}

export const createInvitation = async (createInvitationBody?: CreateInvitationBody, options?: Parameters<typeof orvalFetch>[1]): Promise<createInvitationResponse> => {

    const getHeaders = (h?: NonNullable<RequestInit['headers']>): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h as Iterable<Iterable<string>>, (entry) => Array.from(entry) as [string, string]),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<string | readonly string[] | undefined>(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
return orvalFetch<createInvitationResponse>(getCreateInvitationUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(createInvitationBody)
  }
);}





export const getCreateInvitationMutationKey = () => ['createInvitation'] as const;

export const getCreateInvitationMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createInvitation>>, TError,CreateInvitationMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createInvitation>>, TError,CreateInvitationMutationVariables, TContext> => {

const mutationKey = getCreateInvitationMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createInvitation>>, CreateInvitationMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  createInvitation(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateInvitationMutationResult = NonNullable<Awaited<ReturnType<typeof createInvitation>>>
    export type CreateInvitationMutationBody = CreateInvitationBody | undefined
    export type CreateInvitationMutationError = unknown
    export type CreateInvitationMutationVariables = {data?: CreateInvitationBody}

    export const useCreateInvitation = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createInvitation>>, TError,CreateInvitationMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createInvitation>>,
        TError,
        CreateInvitationMutationVariables,
        TContext
      > => {
      return useMutation(getCreateInvitationMutationOptions(options), queryClient);
    }

export type fetchUserDetailResponse200 = {
  data: FetchUserDetail200
  status: 200
}

export type fetchUserDetailResponseSuccess = (fetchUserDetailResponse200) & {
  headers: Headers;
};
;

export type fetchUserDetailResponse = (fetchUserDetailResponseSuccess)

export const getFetchUserDetailUrl = (params: FetchUserDetailParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/user/detail?${stringifiedParams}` : `/user/detail`
}

export const fetchUserDetail = async (params: FetchUserDetailParams, options?: Parameters<typeof orvalFetch>[1]): Promise<fetchUserDetailResponse> => {

  return orvalFetch<fetchUserDetailResponse>(getFetchUserDetailUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchUserDetailQueryKey = (params?: FetchUserDetailParams,) => {
    return [
    `/user/detail`, ...(params ? [params] : [])
    ] as const;
    }


export const getFetchUserDetailQueryOptions = <TData = Awaited<ReturnType<typeof fetchUserDetail>>, TError = unknown>(params: FetchUserDetailParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetail>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchUserDetailQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchUserDetail>>> = ({ signal }) => fetchUserDetail(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetail>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchUserDetailQueryResult = NonNullable<Awaited<ReturnType<typeof fetchUserDetail>>>
export type FetchUserDetailQueryError = unknown


export function useFetchUserDetail<TData = Awaited<ReturnType<typeof fetchUserDetail>>, TError = unknown>(
 params: FetchUserDetailParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetail>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchUserDetail>>,
          TError,
          Awaited<ReturnType<typeof fetchUserDetail>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchUserDetail<TData = Awaited<ReturnType<typeof fetchUserDetail>>, TError = unknown>(
 params: FetchUserDetailParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetail>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchUserDetail>>,
          TError,
          Awaited<ReturnType<typeof fetchUserDetail>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchUserDetail<TData = Awaited<ReturnType<typeof fetchUserDetail>>, TError = unknown>(
 params: FetchUserDetailParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetail>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchUserDetail<TData = Awaited<ReturnType<typeof fetchUserDetail>>, TError = unknown>(
 params: FetchUserDetailParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetail>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchUserDetailQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type fetchUserDetailsResponse200 = {
  data: FetchUserDetails200Item[]
  status: 200
}

export type fetchUserDetailsResponseSuccess = (fetchUserDetailsResponse200) & {
  headers: Headers;
};
;

export type fetchUserDetailsResponse = (fetchUserDetailsResponseSuccess)

export const getFetchUserDetailsUrl = (params?: FetchUserDetailsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/user/details?${stringifiedParams}` : `/user/details`
}

export const fetchUserDetails = async (params?: FetchUserDetailsParams, options?: Parameters<typeof orvalFetch>[1]): Promise<fetchUserDetailsResponse> => {

  return orvalFetch<fetchUserDetailsResponse>(getFetchUserDetailsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchUserDetailsQueryKey = (params?: FetchUserDetailsParams,) => {
    return [
    `/user/details`, ...(params ? [params] : [])
    ] as const;
    }


export const getFetchUserDetailsQueryOptions = <TData = Awaited<ReturnType<typeof fetchUserDetails>>, TError = unknown>(params?: FetchUserDetailsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetails>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchUserDetailsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchUserDetails>>> = ({ signal }) => fetchUserDetails(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetails>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchUserDetailsQueryResult = NonNullable<Awaited<ReturnType<typeof fetchUserDetails>>>
export type FetchUserDetailsQueryError = unknown


export function useFetchUserDetails<TData = Awaited<ReturnType<typeof fetchUserDetails>>, TError = unknown>(
 params: undefined |  FetchUserDetailsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetails>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchUserDetails>>,
          TError,
          Awaited<ReturnType<typeof fetchUserDetails>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchUserDetails<TData = Awaited<ReturnType<typeof fetchUserDetails>>, TError = unknown>(
 params?: FetchUserDetailsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetails>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchUserDetails>>,
          TError,
          Awaited<ReturnType<typeof fetchUserDetails>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchUserDetails<TData = Awaited<ReturnType<typeof fetchUserDetails>>, TError = unknown>(
 params?: FetchUserDetailsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetails>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchUserDetails<TData = Awaited<ReturnType<typeof fetchUserDetails>>, TError = unknown>(
 params?: FetchUserDetailsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchUserDetails>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchUserDetailsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type fetchPdsResponse200 = {
  data: FetchPds200
  status: 200
}

export type fetchPdsResponseSuccess = (fetchPdsResponse200) & {
  headers: Headers;
};
;

export type fetchPdsResponse = (fetchPdsResponseSuccess)

export const getFetchPdsUrl = (params?: FetchPdsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/pd?${stringifiedParams}` : `/pd`
}

export const fetchPds = async (params?: FetchPdsParams, options?: Parameters<typeof orvalFetch>[1]): Promise<fetchPdsResponse> => {

  return orvalFetch<fetchPdsResponse>(getFetchPdsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchPdsQueryKey = (params?: FetchPdsParams,) => {
    return [
    `/pd`, ...(params ? [params] : [])
    ] as const;
    }


export const getFetchPdsQueryOptions = <TData = Awaited<ReturnType<typeof fetchPds>>, TError = unknown>(params?: FetchPdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchPdsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchPds>>> = ({ signal }) => fetchPds(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchPds>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchPdsQueryResult = NonNullable<Awaited<ReturnType<typeof fetchPds>>>
export type FetchPdsQueryError = unknown


export function useFetchPds<TData = Awaited<ReturnType<typeof fetchPds>>, TError = unknown>(
 params: undefined |  FetchPdsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPds>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchPds>>,
          TError,
          Awaited<ReturnType<typeof fetchPds>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchPds<TData = Awaited<ReturnType<typeof fetchPds>>, TError = unknown>(
 params?: FetchPdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPds>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchPds>>,
          TError,
          Awaited<ReturnType<typeof fetchPds>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchPds<TData = Awaited<ReturnType<typeof fetchPds>>, TError = unknown>(
 params?: FetchPdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchPds<TData = Awaited<ReturnType<typeof fetchPds>>, TError = unknown>(
 params?: FetchPdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchPdsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type fetchWeeklyStatsResponse200 = {
  data: FetchWeeklyStats200
  status: 200
}

export type fetchWeeklyStatsResponseSuccess = (fetchWeeklyStatsResponse200) & {
  headers: Headers;
};
;

export type fetchWeeklyStatsResponse = (fetchWeeklyStatsResponseSuccess)

export const getFetchWeeklyStatsUrl = () => {




  return `/pd/stats/weekly`
}

export const fetchWeeklyStats = async ( options?: Parameters<typeof orvalFetch>[1]): Promise<fetchWeeklyStatsResponse> => {

  return orvalFetch<fetchWeeklyStatsResponse>(getFetchWeeklyStatsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchWeeklyStatsQueryKey = () => {
    return [
    `/pd/stats/weekly`
    ] as const;
    }


export const getFetchWeeklyStatsQueryOptions = <TData = Awaited<ReturnType<typeof fetchWeeklyStats>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchWeeklyStats>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchWeeklyStatsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchWeeklyStats>>> = ({ signal }) => fetchWeeklyStats({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchWeeklyStats>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchWeeklyStatsQueryResult = NonNullable<Awaited<ReturnType<typeof fetchWeeklyStats>>>
export type FetchWeeklyStatsQueryError = unknown


export function useFetchWeeklyStats<TData = Awaited<ReturnType<typeof fetchWeeklyStats>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchWeeklyStats>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchWeeklyStats>>,
          TError,
          Awaited<ReturnType<typeof fetchWeeklyStats>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchWeeklyStats<TData = Awaited<ReturnType<typeof fetchWeeklyStats>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchWeeklyStats>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchWeeklyStats>>,
          TError,
          Awaited<ReturnType<typeof fetchWeeklyStats>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchWeeklyStats<TData = Awaited<ReturnType<typeof fetchWeeklyStats>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchWeeklyStats>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchWeeklyStats<TData = Awaited<ReturnType<typeof fetchWeeklyStats>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchWeeklyStats>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchWeeklyStatsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type createPdResponse201 = {
  data: CreatePd201
  status: 201
}

export type createPdResponse404 = {
  data: CreatePd404
  status: 404
}

export type createPdResponseSuccess = (createPdResponse201) & {
  headers: Headers;
};
export type createPdResponseError = (createPdResponse404) & {
  headers: Headers;
};

export type createPdResponse = (createPdResponseSuccess | createPdResponseError)

export const getCreatePdUrl = () => {




  return `/pd/create`
}

export const createPd = async (createPdBody?: CreatePdBody, options?: Parameters<typeof orvalFetch>[1]): Promise<createPdResponse> => {
    const formData = new FormData();
if(createPdBody?.content !== undefined) {
 formData.append(`content`, createPdBody.content);
 }
if(createPdBody?.quotedPdId !== undefined) {
 formData.append(`quotedPdId`, createPdBody.quotedPdId);
 }
if(createPdBody?.image !== undefined) {
 formData.append(`image`, createPdBody.image);
 }

  return orvalFetch<createPdResponse>(getCreatePdUrl(),
  {
    ...options,
    method: 'POST'
    ,
    body: formData
  }
);}





export const getCreatePdMutationKey = () => ['createPd'] as const;

export const getCreatePdMutationOptions = <TError = CreatePd404,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createPd>>, TError,CreatePdMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createPd>>, TError,CreatePdMutationVariables, TContext> => {

const mutationKey = getCreatePdMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createPd>>, CreatePdMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  createPd(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreatePdMutationResult = NonNullable<Awaited<ReturnType<typeof createPd>>>
    export type CreatePdMutationBody = CreatePdBody | undefined
    export type CreatePdMutationError = CreatePd404
    export type CreatePdMutationVariables = {data?: CreatePdBody}

    export const useCreatePd = <TError = CreatePd404,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createPd>>, TError,CreatePdMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createPd>>,
        TError,
        CreatePdMutationVariables,
        TContext
      > => {
      return useMutation(getCreatePdMutationOptions(options), queryClient);
    }

export type createGifPdResponse201 = {
  data: CreateGifPd201
  status: 201
}

export type createGifPdResponse404 = {
  data: CreateGifPd404
  status: 404
}

export type createGifPdResponseSuccess = (createGifPdResponse201) & {
  headers: Headers;
};
export type createGifPdResponseError = (createGifPdResponse404) & {
  headers: Headers;
};

export type createGifPdResponse = (createGifPdResponseSuccess | createGifPdResponseError)

export const getCreateGifPdUrl = () => {




  return `/pd/create-gif`
}

export const createGifPd = async (createGifPdBody?: CreateGifPdBody, options?: Parameters<typeof orvalFetch>[1]): Promise<createGifPdResponse> => {
    const formData = new FormData();
if(createGifPdBody?.content !== undefined) {
 formData.append(`content`, createGifPdBody.content);
 }
if(createGifPdBody?.quotedPdId !== undefined) {
 formData.append(`quotedPdId`, createGifPdBody.quotedPdId);
 }
if(createGifPdBody?.image !== undefined) {
 formData.append(`image`, createGifPdBody.image);
 }

  return orvalFetch<createGifPdResponse>(getCreateGifPdUrl(),
  {
    ...options,
    method: 'POST'
    ,
    body: formData
  }
);}





export const getCreateGifPdMutationKey = () => ['createGifPd'] as const;

export const getCreateGifPdMutationOptions = <TError = CreateGifPd404,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createGifPd>>, TError,CreateGifPdMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createGifPd>>, TError,CreateGifPdMutationVariables, TContext> => {

const mutationKey = getCreateGifPdMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createGifPd>>, CreateGifPdMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  createGifPd(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateGifPdMutationResult = NonNullable<Awaited<ReturnType<typeof createGifPd>>>
    export type CreateGifPdMutationBody = CreateGifPdBody | undefined
    export type CreateGifPdMutationError = CreateGifPd404
    export type CreateGifPdMutationVariables = {data?: CreateGifPdBody}

    export const useCreateGifPd = <TError = CreateGifPd404,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createGifPd>>, TError,CreateGifPdMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createGifPd>>,
        TError,
        CreateGifPdMutationVariables,
        TContext
      > => {
      return useMutation(getCreateGifPdMutationOptions(options), queryClient);
    }

export type mutatePdLikeResponse201 = {
  data: MutatePdLike201
  status: 201
}

export type mutatePdLikeResponseSuccess = (mutatePdLikeResponse201) & {
  headers: Headers;
};
;

export type mutatePdLikeResponse = (mutatePdLikeResponseSuccess)

export const getMutatePdLikeUrl = () => {




  return `/pd/like`
}

export const mutatePdLike = async (mutatePdLikeBody?: MutatePdLikeBody, options?: Parameters<typeof orvalFetch>[1]): Promise<mutatePdLikeResponse> => {

    const getHeaders = (h?: NonNullable<RequestInit['headers']>): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h as Iterable<Iterable<string>>, (entry) => Array.from(entry) as [string, string]),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<string | readonly string[] | undefined>(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
return orvalFetch<mutatePdLikeResponse>(getMutatePdLikeUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(mutatePdLikeBody)
  }
);}





export const getMutatePdLikeMutationKey = () => ['mutatePdLike'] as const;

export const getMutatePdLikeMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutatePdLike>>, TError,MutatePdLikeMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof mutatePdLike>>, TError,MutatePdLikeMutationVariables, TContext> => {

const mutationKey = getMutatePdLikeMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof mutatePdLike>>, MutatePdLikeMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  mutatePdLike(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type MutatePdLikeMutationResult = NonNullable<Awaited<ReturnType<typeof mutatePdLike>>>
    export type MutatePdLikeMutationBody = MutatePdLikeBody | undefined
    export type MutatePdLikeMutationError = unknown
    export type MutatePdLikeMutationVariables = {data?: MutatePdLikeBody}

    export const useMutatePdLike = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutatePdLike>>, TError,MutatePdLikeMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof mutatePdLike>>,
        TError,
        MutatePdLikeMutationVariables,
        TContext
      > => {
      return useMutation(getMutatePdLikeMutationOptions(options), queryClient);
    }

export type mutatePdBookmarkResponse200 = {
  data: MutatePdBookmark200
  status: 200
}

export type mutatePdBookmarkResponseSuccess = (mutatePdBookmarkResponse200) & {
  headers: Headers;
};
;

export type mutatePdBookmarkResponse = (mutatePdBookmarkResponseSuccess)

export const getMutatePdBookmarkUrl = () => {




  return `/pd/bookmark`
}

export const mutatePdBookmark = async (mutatePdBookmarkBody?: MutatePdBookmarkBody, options?: Parameters<typeof orvalFetch>[1]): Promise<mutatePdBookmarkResponse> => {

    const getHeaders = (h?: NonNullable<RequestInit['headers']>): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h as Iterable<Iterable<string>>, (entry) => Array.from(entry) as [string, string]),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<string | readonly string[] | undefined>(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
return orvalFetch<mutatePdBookmarkResponse>(getMutatePdBookmarkUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(mutatePdBookmarkBody)
  }
);}





export const getMutatePdBookmarkMutationKey = () => ['mutatePdBookmark'] as const;

export const getMutatePdBookmarkMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutatePdBookmark>>, TError,MutatePdBookmarkMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof mutatePdBookmark>>, TError,MutatePdBookmarkMutationVariables, TContext> => {

const mutationKey = getMutatePdBookmarkMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof mutatePdBookmark>>, MutatePdBookmarkMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  mutatePdBookmark(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type MutatePdBookmarkMutationResult = NonNullable<Awaited<ReturnType<typeof mutatePdBookmark>>>
    export type MutatePdBookmarkMutationBody = MutatePdBookmarkBody | undefined
    export type MutatePdBookmarkMutationError = unknown
    export type MutatePdBookmarkMutationVariables = {data?: MutatePdBookmarkBody}

    export const useMutatePdBookmark = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutatePdBookmark>>, TError,MutatePdBookmarkMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof mutatePdBookmark>>,
        TError,
        MutatePdBookmarkMutationVariables,
        TContext
      > => {
      return useMutation(getMutatePdBookmarkMutationOptions(options), queryClient);
    }

export type fetchBookmarkedPdsResponse200 = {
  data: FetchBookmarkedPds200
  status: 200
}

export type fetchBookmarkedPdsResponseSuccess = (fetchBookmarkedPdsResponse200) & {
  headers: Headers;
};
;

export type fetchBookmarkedPdsResponse = (fetchBookmarkedPdsResponseSuccess)

export const getFetchBookmarkedPdsUrl = (params?: FetchBookmarkedPdsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/pd/bookmarks?${stringifiedParams}` : `/pd/bookmarks`
}

export const fetchBookmarkedPds = async (params?: FetchBookmarkedPdsParams, options?: Parameters<typeof orvalFetch>[1]): Promise<fetchBookmarkedPdsResponse> => {

  return orvalFetch<fetchBookmarkedPdsResponse>(getFetchBookmarkedPdsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchBookmarkedPdsQueryKey = (params?: FetchBookmarkedPdsParams,) => {
    return [
    `/pd/bookmarks`, ...(params ? [params] : [])
    ] as const;
    }


export const getFetchBookmarkedPdsQueryOptions = <TData = Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError = unknown>(params?: FetchBookmarkedPdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchBookmarkedPdsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchBookmarkedPds>>> = ({ signal }) => fetchBookmarkedPds(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchBookmarkedPdsQueryResult = NonNullable<Awaited<ReturnType<typeof fetchBookmarkedPds>>>
export type FetchBookmarkedPdsQueryError = unknown


export function useFetchBookmarkedPds<TData = Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError = unknown>(
 params: undefined |  FetchBookmarkedPdsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchBookmarkedPds>>,
          TError,
          Awaited<ReturnType<typeof fetchBookmarkedPds>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchBookmarkedPds<TData = Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError = unknown>(
 params?: FetchBookmarkedPdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchBookmarkedPds>>,
          TError,
          Awaited<ReturnType<typeof fetchBookmarkedPds>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchBookmarkedPds<TData = Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError = unknown>(
 params?: FetchBookmarkedPdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchBookmarkedPds<TData = Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError = unknown>(
 params?: FetchBookmarkedPdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchBookmarkedPds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchBookmarkedPdsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type fetchPdImageResponse200 = {
  data: Blob
  status: 200
}

export type fetchPdImageResponseSuccess = (fetchPdImageResponse200) & {
  headers: Headers;
};
;

export type fetchPdImageResponse = (fetchPdImageResponseSuccess)

export const getFetchPdImageUrl = (fileName: string,) => {




  return `/pd/image/${fileName}`
}

export const fetchPdImage = async (fileName: string, options?: Parameters<typeof orvalFetch>[1]): Promise<fetchPdImageResponse> => {

  return orvalFetch<fetchPdImageResponse>(getFetchPdImageUrl(fileName),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchPdImageQueryKey = (fileName: string,) => {
    return [
    `/pd/image/${fileName}`
    ] as const;
    }


export const getFetchPdImageQueryOptions = <TData = Awaited<ReturnType<typeof fetchPdImage>>, TError = unknown>(fileName: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPdImage>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchPdImageQueryKey(fileName);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchPdImage>>> = ({ signal }) => fetchPdImage(fileName, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: fileName !== null && fileName !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchPdImage>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchPdImageQueryResult = NonNullable<Awaited<ReturnType<typeof fetchPdImage>>>
export type FetchPdImageQueryError = unknown


export function useFetchPdImage<TData = Awaited<ReturnType<typeof fetchPdImage>>, TError = unknown>(
 fileName: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPdImage>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchPdImage>>,
          TError,
          Awaited<ReturnType<typeof fetchPdImage>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchPdImage<TData = Awaited<ReturnType<typeof fetchPdImage>>, TError = unknown>(
 fileName: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPdImage>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchPdImage>>,
          TError,
          Awaited<ReturnType<typeof fetchPdImage>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchPdImage<TData = Awaited<ReturnType<typeof fetchPdImage>>, TError = unknown>(
 fileName: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPdImage>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchPdImage<TData = Awaited<ReturnType<typeof fetchPdImage>>, TError = unknown>(
 fileName: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchPdImage>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchPdImageQueryOptions(fileName,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type fetchRePdsResponse200 = {
  data: FetchRePds200Item[]
  status: 200
}

export type fetchRePdsResponseSuccess = (fetchRePdsResponse200) & {
  headers: Headers;
};
;

export type fetchRePdsResponse = (fetchRePdsResponseSuccess)

export const getFetchRePdsUrl = (params: FetchRePdsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/repd?${stringifiedParams}` : `/repd`
}

export const fetchRePds = async (params: FetchRePdsParams, options?: Parameters<typeof orvalFetch>[1]): Promise<fetchRePdsResponse> => {

  return orvalFetch<fetchRePdsResponse>(getFetchRePdsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchRePdsQueryKey = (params?: FetchRePdsParams,) => {
    return [
    `/repd`, ...(params ? [params] : [])
    ] as const;
    }


export const getFetchRePdsQueryOptions = <TData = Awaited<ReturnType<typeof fetchRePds>>, TError = unknown>(params: FetchRePdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchRePds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchRePdsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchRePds>>> = ({ signal }) => fetchRePds(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchRePds>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchRePdsQueryResult = NonNullable<Awaited<ReturnType<typeof fetchRePds>>>
export type FetchRePdsQueryError = unknown


export function useFetchRePds<TData = Awaited<ReturnType<typeof fetchRePds>>, TError = unknown>(
 params: FetchRePdsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchRePds>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchRePds>>,
          TError,
          Awaited<ReturnType<typeof fetchRePds>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchRePds<TData = Awaited<ReturnType<typeof fetchRePds>>, TError = unknown>(
 params: FetchRePdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchRePds>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchRePds>>,
          TError,
          Awaited<ReturnType<typeof fetchRePds>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchRePds<TData = Awaited<ReturnType<typeof fetchRePds>>, TError = unknown>(
 params: FetchRePdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchRePds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchRePds<TData = Awaited<ReturnType<typeof fetchRePds>>, TError = unknown>(
 params: FetchRePdsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchRePds>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchRePdsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type createRePdResponse201 = {
  data: CreateRePd201
  status: 201
}

export type createRePdResponseSuccess = (createRePdResponse201) & {
  headers: Headers;
};
;

export type createRePdResponse = (createRePdResponseSuccess)

export const getCreateRePdUrl = () => {




  return `/repd/create`
}

export const createRePd = async (createRePdBody?: CreateRePdBody, options?: Parameters<typeof orvalFetch>[1]): Promise<createRePdResponse> => {

    const getHeaders = (h?: NonNullable<RequestInit['headers']>): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h as Iterable<Iterable<string>>, (entry) => Array.from(entry) as [string, string]),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<string | readonly string[] | undefined>(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
return orvalFetch<createRePdResponse>(getCreateRePdUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(createRePdBody)
  }
);}





export const getCreateRePdMutationKey = () => ['createRePd'] as const;

export const getCreateRePdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createRePd>>, TError,CreateRePdMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createRePd>>, TError,CreateRePdMutationVariables, TContext> => {

const mutationKey = getCreateRePdMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createRePd>>, CreateRePdMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  createRePd(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateRePdMutationResult = NonNullable<Awaited<ReturnType<typeof createRePd>>>
    export type CreateRePdMutationBody = CreateRePdBody | undefined
    export type CreateRePdMutationError = unknown
    export type CreateRePdMutationVariables = {data?: CreateRePdBody}

    export const useCreateRePd = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createRePd>>, TError,CreateRePdMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createRePd>>,
        TError,
        CreateRePdMutationVariables,
        TContext
      > => {
      return useMutation(getCreateRePdMutationOptions(options), queryClient);
    }

export type mutateRePdLikeResponse201 = {
  data: MutateRePdLike201
  status: 201
}

export type mutateRePdLikeResponseSuccess = (mutateRePdLikeResponse201) & {
  headers: Headers;
};
;

export type mutateRePdLikeResponse = (mutateRePdLikeResponseSuccess)

export const getMutateRePdLikeUrl = () => {




  return `/repd/like`
}

export const mutateRePdLike = async (mutateRePdLikeBody?: MutateRePdLikeBody, options?: Parameters<typeof orvalFetch>[1]): Promise<mutateRePdLikeResponse> => {

    const getHeaders = (h?: NonNullable<RequestInit['headers']>): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h as Iterable<Iterable<string>>, (entry) => Array.from(entry) as [string, string]),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<string | readonly string[] | undefined>(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
return orvalFetch<mutateRePdLikeResponse>(getMutateRePdLikeUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(mutateRePdLikeBody)
  }
);}





export const getMutateRePdLikeMutationKey = () => ['mutateRePdLike'] as const;

export const getMutateRePdLikeMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutateRePdLike>>, TError,MutateRePdLikeMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof mutateRePdLike>>, TError,MutateRePdLikeMutationVariables, TContext> => {

const mutationKey = getMutateRePdLikeMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof mutateRePdLike>>, MutateRePdLikeMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  mutateRePdLike(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type MutateRePdLikeMutationResult = NonNullable<Awaited<ReturnType<typeof mutateRePdLike>>>
    export type MutateRePdLikeMutationBody = MutateRePdLikeBody | undefined
    export type MutateRePdLikeMutationError = unknown
    export type MutateRePdLikeMutationVariables = {data?: MutateRePdLikeBody}

    export const useMutateRePdLike = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutateRePdLike>>, TError,MutateRePdLikeMutationVariables, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof mutateRePdLike>>,
        TError,
        MutateRePdLikeMutationVariables,
        TContext
      > => {
      return useMutation(getMutateRePdLikeMutationOptions(options), queryClient);
    }

export type fetchNotificationUnreadCountResponse200 = {
  data: FetchNotificationUnreadCount200
  status: 200
}

export type fetchNotificationUnreadCountResponseSuccess = (fetchNotificationUnreadCountResponse200) & {
  headers: Headers;
};
;

export type fetchNotificationUnreadCountResponse = (fetchNotificationUnreadCountResponseSuccess)

export const getFetchNotificationUnreadCountUrl = () => {




  return `/notifications/unread-count`
}

export const fetchNotificationUnreadCount = async ( options?: Parameters<typeof orvalFetch>[1]): Promise<fetchNotificationUnreadCountResponse> => {

  return orvalFetch<fetchNotificationUnreadCountResponse>(getFetchNotificationUnreadCountUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchNotificationUnreadCountQueryKey = () => {
    return [
    `/notifications/unread-count`
    ] as const;
    }


export const getFetchNotificationUnreadCountQueryOptions = <TData = Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchNotificationUnreadCountQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchNotificationUnreadCount>>> = ({ signal }) => fetchNotificationUnreadCount({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchNotificationUnreadCountQueryResult = NonNullable<Awaited<ReturnType<typeof fetchNotificationUnreadCount>>>
export type FetchNotificationUnreadCountQueryError = unknown


export function useFetchNotificationUnreadCount<TData = Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchNotificationUnreadCount>>,
          TError,
          Awaited<ReturnType<typeof fetchNotificationUnreadCount>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchNotificationUnreadCount<TData = Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchNotificationUnreadCount>>,
          TError,
          Awaited<ReturnType<typeof fetchNotificationUnreadCount>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchNotificationUnreadCount<TData = Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchNotificationUnreadCount<TData = Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotificationUnreadCount>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchNotificationUnreadCountQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type fetchNotificationsResponse200 = {
  data: FetchNotifications200
  status: 200
}

export type fetchNotificationsResponseSuccess = (fetchNotificationsResponse200) & {
  headers: Headers;
};
;

export type fetchNotificationsResponse = (fetchNotificationsResponseSuccess)

export const getFetchNotificationsUrl = (params?: FetchNotificationsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/notifications?${stringifiedParams}` : `/notifications`
}

export const fetchNotifications = async (params?: FetchNotificationsParams, options?: Parameters<typeof orvalFetch>[1]): Promise<fetchNotificationsResponse> => {

  return orvalFetch<fetchNotificationsResponse>(getFetchNotificationsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getFetchNotificationsQueryKey = (params?: FetchNotificationsParams,) => {
    return [
    `/notifications`, ...(params ? [params] : [])
    ] as const;
    }


export const getFetchNotificationsQueryOptions = <TData = Awaited<ReturnType<typeof fetchNotifications>>, TError = unknown>(params?: FetchNotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotifications>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getFetchNotificationsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof fetchNotifications>>> = ({ signal }) => fetchNotifications(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof fetchNotifications>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type FetchNotificationsQueryResult = NonNullable<Awaited<ReturnType<typeof fetchNotifications>>>
export type FetchNotificationsQueryError = unknown


export function useFetchNotifications<TData = Awaited<ReturnType<typeof fetchNotifications>>, TError = unknown>(
 params: undefined |  FetchNotificationsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotifications>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchNotifications>>,
          TError,
          Awaited<ReturnType<typeof fetchNotifications>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchNotifications<TData = Awaited<ReturnType<typeof fetchNotifications>>, TError = unknown>(
 params?: FetchNotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotifications>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof fetchNotifications>>,
          TError,
          Awaited<ReturnType<typeof fetchNotifications>>
        > , 'initialData'
      >, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useFetchNotifications<TData = Awaited<ReturnType<typeof fetchNotifications>>, TError = unknown>(
 params?: FetchNotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotifications>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useFetchNotifications<TData = Awaited<ReturnType<typeof fetchNotifications>>, TError = unknown>(
 params?: FetchNotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof fetchNotifications>>, TError, TData>>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getFetchNotificationsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}







export type markNotificationsSeenResponse200 = {
  data: MarkNotificationsSeen200
  status: 200
}

export type markNotificationsSeenResponseSuccess = (markNotificationsSeenResponse200) & {
  headers: Headers;
};
;

export type markNotificationsSeenResponse = (markNotificationsSeenResponseSuccess)

export const getMarkNotificationsSeenUrl = () => {




  return `/notifications/seen`
}

export const markNotificationsSeen = async ( options?: Parameters<typeof orvalFetch>[1]): Promise<markNotificationsSeenResponse> => {

  return orvalFetch<markNotificationsSeenResponse>(getMarkNotificationsSeenUrl(),
  {
    ...options,
    method: 'POST'


  }
);}





export const getMarkNotificationsSeenMutationKey = () => ['markNotificationsSeen'] as const;

export const getMarkNotificationsSeenMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof markNotificationsSeen>>, TError,void, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof markNotificationsSeen>>, TError,void, TContext> => {

const mutationKey = getMarkNotificationsSeenMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof markNotificationsSeen>>, void> = () => {


          return  markNotificationsSeen(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type MarkNotificationsSeenMutationResult = NonNullable<Awaited<ReturnType<typeof markNotificationsSeen>>>

    export type MarkNotificationsSeenMutationError = unknown


    export const useMarkNotificationsSeen = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof markNotificationsSeen>>, TError,void, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof markNotificationsSeen>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getMarkNotificationsSeenMutationOptions(options), queryClient);
    }

