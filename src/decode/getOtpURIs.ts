import {
  Algorithm,
  DigitCount,
  OtpParameters,
  OtpType,
} from './MigrationPayload';
import { HOTP, TOTP, Secret } from 'otpauth';

export function getOtpAuthUris(otpExportParams: OtpParameters[]) {
  return otpExportParams.map((account) => {
    const secret = new Secret({ buffer: account.secret });
    switch(account.type) {
      case OtpType.OTP_TYPE_TOTP:
        return new TOTP({
          issuer: account.issuer,
          algorithm: getAlgFromEnum(account.algorithm),
          digits: getDigitsFromEnum(account.digits),
          label: account.name,
          secret,
        }).toString();
      case OtpType.OTP_TYPE_HOTP:
        return new HOTP({
          issuer: account.issuer,
          algorithm: getAlgFromEnum(account.algorithm),
          digits: getDigitsFromEnum(account.digits),
          label: account.name,
          counter: account.counter,
          secret,
        }).toString();
      default:
        return `${account.name}: No Type specified, couln't transform.`;
    }
  });
}

function getAlgFromEnum(alg: Algorithm) {
  switch (alg) {
    case Algorithm.ALGORITHM_MD5:
      return 'MD5';
    case Algorithm.ALGORITHM_SHA256:
      return 'SHA256';
    case Algorithm.ALGORITHM_SHA512:
      return 'SHA512';
    default:
      return 'SHA1';
  }
}

function getDigitsFromEnum(digits: DigitCount) {
  switch (digits) {
    case DigitCount.DIGIT_COUNT_EIGHT:
      return 8;
    default:
      return 6;
  }
}
