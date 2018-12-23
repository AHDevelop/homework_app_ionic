import { Injectable } from '@angular/core';

/*
グローバル変数格納用の親クラス
*/
@Injectable()
export class MyGlobalValue {
  isSingIn:boolean = false;

  /*
  * ログイン中のユーザー情報
  * user_id, email, user_name, auth_type, auth_id, access_token
  */
  userInfo:any = {};

  /*
  * ログイン中の部屋情報
  * "room_id","room_name","user_id","is_owned","room_number"
  */
  roomInfo:any = {};

  /*
  * 招待情報
  * "invite_room_id","invite_from_user_id"
  */
  inviteInfo:any = {};
}
