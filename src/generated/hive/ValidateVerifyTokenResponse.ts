// Original file: proto/authbee.proto

import type { Long } from '@grpc/proto-loader';

export interface ValidateVerifyTokenResponse {
  'token'?: (string);
  'expiresAt'?: (number | string | Long);
  'userId'?: (string);
}

export interface ValidateVerifyTokenResponse__Output {
  'token': (string);
  'expiresAt': (string);
  'userId': (string);
}
