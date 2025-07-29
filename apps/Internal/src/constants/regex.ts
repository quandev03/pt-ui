export const RegOnlyNum = /^\d+$/;
export const RegValidPass =
  '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[~@#$!%^*?&()])[A-Za-z\\d@$!%*?&]';
// eslint-disable-next-line no-useless-escape
export const RegValidStringEnglish =
  // eslint-disable-next-line no-useless-escape
  /^[~`!@#$%^&*()_+=[\]\{}|;':",.\\/<>?a-zA-Z0-9-]+$/;

// eslint-disable-next-line no-useless-escape
export const RegexIdNoCard = /^\d{12}$/;
export const RegexAccountAlias = /^[a-z0-9]([a-z0-9]|-(?!-)){1,61}[a-z0-9]$/;

export const RegexOnlyTextAndSpace = /^[\p{L}\s]+$/u;
export const textOnlyRegex = /^[a-zA-Z0-9]+$/;
export const textSpaceRegex = /^[a-zA-Z0-9\s]+$/;
export const phoneRegex = /^0[3|5|7|8|9][0-9]{8}$/;
export const vietnameseAlphabetAndNumbersRegex =
  /^[a-zA-Z0-9ÀÁÂÃÈÉÊỀỀỂỄỆÌÍÒÓÔÕÙÚĂẮẰẲẴẶĐĨŨƠỚỜỞỠỢơàáâãèéêềềểễệêìíòóôõùúăắằẳẵặđĩũơớờởỡợƯỪỨỬỮỰừứửữựưýỳỵỷỹÝỲỴỶỸ\s]+$/;
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&^()_\-=\+\[\]{}\\|/'"<>\/#])[A-Za-z\d@$!%*?&^()_\-=\+\[\]{}\\|/'"<>\/#]{8,}$/;
