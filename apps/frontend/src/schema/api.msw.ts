import {
  HttpResponse,
  http
} from 'msw';
import type {
  RequestHandlerOptions
} from 'msw';

import type {
  CreateGifPd201,
  CreateInvitation200,
  CreatePd201,
  CreateRePd201,
  FetchNotificationUnreadCount200,
  FetchNotifications200,
  FetchPds200,
  FetchRePds200Item,
  FetchUserDetail200,
  FetchUserDetails200Item,
  FetchWeeklyStats200,
  MarkNotificationsSeen200,
  MutatePdLike201,
  MutateRePdLike201
} from './models';


export const getCreateInvitationResponseMock = (): CreateInvitation200 => ({"message":"招待を作成しました"})

export const getFetchUserDetailResponseMock = (): FetchUserDetail200 => ({"id":"user_2abc","firstName":"太郎","lastName":"田中","imageUrl":"https://img.clerk.com/example.png","userName":"taro"})

export const getFetchUserDetailsResponseMock = (): FetchUserDetails200Item[] => ([{"id":"user_2abc","firstName":"太郎","lastName":"田中","imageUrl":"https://img.clerk.com/example.png","userName":"taro"}])

export const getFetchPdsResponseMock = (): FetchPds200 => ({"items":[{"isMyPd":false,"likeCount":3,"replyCount":1,"likes":[{"userId":"user_2abc"}],"id":"0190d2c0-0000-7000-8000-000000000001","content":"今日学んだことを共有します","createdAt":"2026-06-24T00:00:00.000Z","userId":"user_2abc","imageFileName":null}]})

export const getFetchWeeklyStatsResponseMock = (): FetchWeeklyStats200 => ({"range":{"start":"2026-06-18","end":"2026-06-24"},"totals":{"pdCount":20,"rePdCount":30,"likeCount":50,"activeAuthorCount":4,"averagePdPerAuthor":5},"daily":[{"date":"2026-06-24","pdCount":5,"rePdCount":8,"likeCount":12}],"rankings":[{"userId":"user_2abc","pdCount":5,"rePdCount":8,"likeCount":12}]})

export const getCreatePdResponseMock = (): CreatePd201 => ({"message":"PDが作成されました"})

export const getCreateGifPdResponseMock = (): CreateGifPd201 => ({"message":"GIF付きPDが作成されました"})

export const getMutatePdLikeResponseMock = (): MutatePdLike201 => ({"message":"いいね状態を更新しました"})

export const getFetchPdImageResponseMock = () => ((() =>
              Uint8Array.from(
                atob(
                  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                ),
                (char) => char.charCodeAt(0)
              ).buffer)())

export const getFetchRePdsResponseMock = (): FetchRePds200Item[] => ([{"isMyRePd":false,"likeCount":2,"likes":[{"userId":"user_2abc"}],"id":"0190d2c0-0000-7000-8000-000000000003","content":"とても参考になりました","createdAt":"2026-06-24T00:00:00.000Z","userId":"user_2abc","pdId":"0190d2c0-0000-7000-8000-000000000001"}])

export const getCreateRePdResponseMock = (): CreateRePd201 => ({"message":"RePDが作成されました"})

export const getMutateRePdLikeResponseMock = (): MutateRePdLike201 => ({"message":"RePDのいいね状態を更新しました"})

export const getFetchNotificationUnreadCountResponseMock = (): FetchNotificationUnreadCount200 => ({"count":3})

export const getFetchNotificationsResponseMock = (): FetchNotifications200 => ({"items":[{"kind":"pdLike","actor":{"id":"user_2abc","firstName":"太郎","lastName":"田中","imageUrl":"https://img.clerk.com/example.png","userName":"taro"},"pdId":"0190d2c0-0000-7000-8000-000000000001","rePdId":null,"excerpt":"今日学んだことを共有します","createdAt":"2026-06-24T00:00:00.000Z"}]})

export const getMarkNotificationsSeenResponseMock = (): MarkNotificationsSeen200 => ({"ok":true})


export const getCreateInvitationMockHandler = (overrideResponse?: CreateInvitation200 | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CreateInvitation200> | CreateInvitation200), options?: RequestHandlerOptions) => {
  return http.post('*/invitation/create', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCreateInvitationResponseMock(),
      { status: 200
      })
  }, options)
}

export const getFetchUserDetailMockHandler = (overrideResponse?: FetchUserDetail200 | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<FetchUserDetail200> | FetchUserDetail200), options?: RequestHandlerOptions) => {
  return http.get('*/user/detail', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getFetchUserDetailResponseMock(),
      { status: 200
      })
  }, options)
}

export const getFetchUserDetailsMockHandler = (overrideResponse?: FetchUserDetails200Item[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<FetchUserDetails200Item[]> | FetchUserDetails200Item[]), options?: RequestHandlerOptions) => {
  return http.get('*/user/details', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getFetchUserDetailsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getFetchPdsMockHandler = (overrideResponse?: FetchPds200 | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<FetchPds200> | FetchPds200), options?: RequestHandlerOptions) => {
  return http.get('*/pd', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getFetchPdsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getFetchWeeklyStatsMockHandler = (overrideResponse?: FetchWeeklyStats200 | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<FetchWeeklyStats200> | FetchWeeklyStats200), options?: RequestHandlerOptions) => {
  return http.get('*/pd/stats/weekly', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getFetchWeeklyStatsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCreatePdMockHandler = (overrideResponse?: CreatePd201 | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CreatePd201> | CreatePd201), options?: RequestHandlerOptions) => {
  return http.post('*/pd/create', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCreatePdResponseMock(),
      { status: 201
      })
  }, options)
}

export const getCreateGifPdMockHandler = (overrideResponse?: CreateGifPd201 | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CreateGifPd201> | CreateGifPd201), options?: RequestHandlerOptions) => {
  return http.post('*/pd/create-gif', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCreateGifPdResponseMock(),
      { status: 201
      })
  }, options)
}

export const getMutatePdLikeMockHandler = (overrideResponse?: MutatePdLike201 | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<MutatePdLike201> | MutatePdLike201), options?: RequestHandlerOptions) => {
  return http.put('*/pd/like', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getMutatePdLikeResponseMock(),
      { status: 201
      })
  }, options)
}

export const getFetchPdImageMockHandler = (overrideResponse?: ArrayBuffer | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ArrayBuffer> | ArrayBuffer), options?: RequestHandlerOptions) => {
  return http.get('*/pd/image/:fileName', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {

  const binaryBody = overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getFetchPdImageResponseMock();
    return HttpResponse.arrayBuffer(
      binaryBody instanceof ArrayBuffer
        ? binaryBody
        : new ArrayBuffer(0),
      { status: 200,
        headers: { 'Content-Type': 'application/octet-stream' }
      })
  }, options)
}

export const getFetchRePdsMockHandler = (overrideResponse?: FetchRePds200Item[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<FetchRePds200Item[]> | FetchRePds200Item[]), options?: RequestHandlerOptions) => {
  return http.get('*/repd', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getFetchRePdsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCreateRePdMockHandler = (overrideResponse?: CreateRePd201 | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CreateRePd201> | CreateRePd201), options?: RequestHandlerOptions) => {
  return http.post('*/repd/create', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCreateRePdResponseMock(),
      { status: 201
      })
  }, options)
}

export const getMutateRePdLikeMockHandler = (overrideResponse?: MutateRePdLike201 | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<MutateRePdLike201> | MutateRePdLike201), options?: RequestHandlerOptions) => {
  return http.put('*/repd/like', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getMutateRePdLikeResponseMock(),
      { status: 201
      })
  }, options)
}

export const getFetchNotificationUnreadCountMockHandler = (overrideResponse?: FetchNotificationUnreadCount200 | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<FetchNotificationUnreadCount200> | FetchNotificationUnreadCount200), options?: RequestHandlerOptions) => {
  return http.get('*/notifications/unread-count', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getFetchNotificationUnreadCountResponseMock(),
      { status: 200
      })
  }, options)
}

export const getFetchNotificationsMockHandler = (overrideResponse?: FetchNotifications200 | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<FetchNotifications200> | FetchNotifications200), options?: RequestHandlerOptions) => {
  return http.get('*/notifications', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getFetchNotificationsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getMarkNotificationsSeenMockHandler = (overrideResponse?: MarkNotificationsSeen200 | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<MarkNotificationsSeen200> | MarkNotificationsSeen200), options?: RequestHandlerOptions) => {
  return http.post('*/notifications/seen', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getMarkNotificationsSeenResponseMock(),
      { status: 200
      })
  }, options)
}
export const getPdcxaApiMock = () => [
  getCreateInvitationMockHandler(),
  getFetchUserDetailMockHandler(),
  getFetchUserDetailsMockHandler(),
  getFetchPdsMockHandler(),
  getFetchWeeklyStatsMockHandler(),
  getCreatePdMockHandler(),
  getCreateGifPdMockHandler(),
  getMutatePdLikeMockHandler(),
  getFetchPdImageMockHandler(),
  getFetchRePdsMockHandler(),
  getCreateRePdMockHandler(),
  getMutateRePdLikeMockHandler(),
  getFetchNotificationUnreadCountMockHandler(),
  getFetchNotificationsMockHandler(),
  getMarkNotificationsSeenMockHandler()
]
