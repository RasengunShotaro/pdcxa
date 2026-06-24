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
  CreateGifPdBody,
  CreateInvitation200,
  CreateInvitationBody,
  CreatePd201,
  CreatePdBody,
  CreateRePd201,
  CreateRePdBody,
  FetchPds200,
  FetchPdsParams,
  FetchRePds200Item,
  FetchRePdsParams,
  FetchUserDetail200,
  FetchUserDetailParams,
  FetchUserDetails200Item,
  FetchUserDetailsParams,
  FetchWeeklyStats200,
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

export const createInvitation = async (createInvitationBody?: CreateInvitationBody, options?: RequestInit): Promise<createInvitationResponse> => {

  return orvalFetch<createInvitationResponse>(getCreateInvitationUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createInvitationBody)
  }
);}




export const getCreateInvitationMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createInvitation>>, TError,{data?: CreateInvitationBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createInvitation>>, TError,{data?: CreateInvitationBody}, TContext> => {

const mutationKey = ['createInvitation'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createInvitation>>, {data?: CreateInvitationBody}> = (props) => {
          const {data} = props ?? {};

          return  createInvitation(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateInvitationMutationResult = NonNullable<Awaited<ReturnType<typeof createInvitation>>>
    export type CreateInvitationMutationBody = CreateInvitationBody | undefined
    export type CreateInvitationMutationError = unknown

    export const useCreateInvitation = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createInvitation>>, TError,{data?: CreateInvitationBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createInvitation>>,
        TError,
        {data?: CreateInvitationBody},
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

export const fetchUserDetail = async (params: FetchUserDetailParams, options?: RequestInit): Promise<fetchUserDetailResponse> => {

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

export const fetchUserDetails = async (params?: FetchUserDetailsParams, options?: RequestInit): Promise<fetchUserDetailsResponse> => {

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

export const fetchPds = async (params?: FetchPdsParams, options?: RequestInit): Promise<fetchPdsResponse> => {

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

export const fetchWeeklyStats = async ( options?: RequestInit): Promise<fetchWeeklyStatsResponse> => {

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

export type createPdResponseSuccess = (createPdResponse201) & {
  headers: Headers;
};
;

export type createPdResponse = (createPdResponseSuccess)

export const getCreatePdUrl = () => {




  return `/pd/create`
}

export const createPd = async (createPdBody?: CreatePdBody, options?: RequestInit): Promise<createPdResponse> => {
    const formData = new FormData();
if(createPdBody?.content !== undefined) {
 formData.append(`content`, createPdBody.content);
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




export const getCreatePdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createPd>>, TError,{data?: CreatePdBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createPd>>, TError,{data?: CreatePdBody}, TContext> => {

const mutationKey = ['createPd'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createPd>>, {data?: CreatePdBody}> = (props) => {
          const {data} = props ?? {};

          return  createPd(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreatePdMutationResult = NonNullable<Awaited<ReturnType<typeof createPd>>>
    export type CreatePdMutationBody = CreatePdBody | undefined
    export type CreatePdMutationError = unknown

    export const useCreatePd = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createPd>>, TError,{data?: CreatePdBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createPd>>,
        TError,
        {data?: CreatePdBody},
        TContext
      > => {
      return useMutation(getCreatePdMutationOptions(options), queryClient);
    }

export type createGifPdResponse201 = {
  data: CreateGifPd201
  status: 201
}

export type createGifPdResponseSuccess = (createGifPdResponse201) & {
  headers: Headers;
};
;

export type createGifPdResponse = (createGifPdResponseSuccess)

export const getCreateGifPdUrl = () => {




  return `/pd/create-gif`
}

export const createGifPd = async (createGifPdBody?: CreateGifPdBody, options?: RequestInit): Promise<createGifPdResponse> => {
    const formData = new FormData();
if(createGifPdBody?.content !== undefined) {
 formData.append(`content`, createGifPdBody.content);
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




export const getCreateGifPdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createGifPd>>, TError,{data?: CreateGifPdBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createGifPd>>, TError,{data?: CreateGifPdBody}, TContext> => {

const mutationKey = ['createGifPd'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createGifPd>>, {data?: CreateGifPdBody}> = (props) => {
          const {data} = props ?? {};

          return  createGifPd(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateGifPdMutationResult = NonNullable<Awaited<ReturnType<typeof createGifPd>>>
    export type CreateGifPdMutationBody = CreateGifPdBody | undefined
    export type CreateGifPdMutationError = unknown

    export const useCreateGifPd = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createGifPd>>, TError,{data?: CreateGifPdBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createGifPd>>,
        TError,
        {data?: CreateGifPdBody},
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

export const mutatePdLike = async (mutatePdLikeBody?: MutatePdLikeBody, options?: RequestInit): Promise<mutatePdLikeResponse> => {

  return orvalFetch<mutatePdLikeResponse>(getMutatePdLikeUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(mutatePdLikeBody)
  }
);}




export const getMutatePdLikeMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutatePdLike>>, TError,{data?: MutatePdLikeBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof mutatePdLike>>, TError,{data?: MutatePdLikeBody}, TContext> => {

const mutationKey = ['mutatePdLike'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof mutatePdLike>>, {data?: MutatePdLikeBody}> = (props) => {
          const {data} = props ?? {};

          return  mutatePdLike(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type MutatePdLikeMutationResult = NonNullable<Awaited<ReturnType<typeof mutatePdLike>>>
    export type MutatePdLikeMutationBody = MutatePdLikeBody | undefined
    export type MutatePdLikeMutationError = unknown

    export const useMutatePdLike = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutatePdLike>>, TError,{data?: MutatePdLikeBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof mutatePdLike>>,
        TError,
        {data?: MutatePdLikeBody},
        TContext
      > => {
      return useMutation(getMutatePdLikeMutationOptions(options), queryClient);
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

export const fetchRePds = async (params: FetchRePdsParams, options?: RequestInit): Promise<fetchRePdsResponse> => {

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

export const createRePd = async (createRePdBody?: CreateRePdBody, options?: RequestInit): Promise<createRePdResponse> => {

  return orvalFetch<createRePdResponse>(getCreateRePdUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createRePdBody)
  }
);}




export const getCreateRePdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createRePd>>, TError,{data?: CreateRePdBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createRePd>>, TError,{data?: CreateRePdBody}, TContext> => {

const mutationKey = ['createRePd'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createRePd>>, {data?: CreateRePdBody}> = (props) => {
          const {data} = props ?? {};

          return  createRePd(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateRePdMutationResult = NonNullable<Awaited<ReturnType<typeof createRePd>>>
    export type CreateRePdMutationBody = CreateRePdBody | undefined
    export type CreateRePdMutationError = unknown

    export const useCreateRePd = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createRePd>>, TError,{data?: CreateRePdBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createRePd>>,
        TError,
        {data?: CreateRePdBody},
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

export const mutateRePdLike = async (mutateRePdLikeBody?: MutateRePdLikeBody, options?: RequestInit): Promise<mutateRePdLikeResponse> => {

  return orvalFetch<mutateRePdLikeResponse>(getMutateRePdLikeUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(mutateRePdLikeBody)
  }
);}




export const getMutateRePdLikeMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutateRePdLike>>, TError,{data?: MutateRePdLikeBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof mutateRePdLike>>, TError,{data?: MutateRePdLikeBody}, TContext> => {

const mutationKey = ['mutateRePdLike'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof mutateRePdLike>>, {data?: MutateRePdLikeBody}> = (props) => {
          const {data} = props ?? {};

          return  mutateRePdLike(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type MutateRePdLikeMutationResult = NonNullable<Awaited<ReturnType<typeof mutateRePdLike>>>
    export type MutateRePdLikeMutationBody = MutateRePdLikeBody | undefined
    export type MutateRePdLikeMutationError = unknown

    export const useMutateRePdLike = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof mutateRePdLike>>, TError,{data?: MutateRePdLikeBody}, TContext>, request?: SecondParameter<typeof orvalFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof mutateRePdLike>>,
        TError,
        {data?: MutateRePdLikeBody},
        TContext
      > => {
      return useMutation(getMutateRePdLikeMutationOptions(options), queryClient);
    }

