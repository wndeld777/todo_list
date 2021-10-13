import { useUserContext } from "../context";
import { useHistory } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { fetchUser } from "../modules/fetchModule";

function AuthRoute({ children }) {
  const { user, setUser } = useUserContext();
  const history = useHistory();

  const fetchCallback = useCallback(async () => {
    window.gapi.auth2.init({
      client_id:
        "232719777758-soudq3dk3c9qicanv8nqtnpi9srmdmq2.apps.googleusercontent.com",
      scope: "profile email",
    });

    if (!window.gapi) {
      alert("google API Not Found!!!");
      history.replace("/login");
    }

    // gapi(google API)로 부터 auth2 객체를 조회하기
    const auth2 = window?.gapi?.auth2.getAuthInstance();
    if (!auth2) {
      history.replace("/login");
    }

    // 로그인되어있는 사용자 정보 getter
    const googleUser = auth2.currentUser.get();
    const profile = googleUser.getBasicProfile();

    if (!profile) {
      history.replace("/login");
    }

    const user = {
      userid: profile.getEmail(),
      name: profile.getName(),
      image: profile.getImageUrl(),
      Token: googleUser.getAuthResponse().id_token,
    };
    setUser(user);
  });
  useEffect(fetchCallback, [fetchCallback]);
  return <>{children}</>;
}

export default AuthRoute;
