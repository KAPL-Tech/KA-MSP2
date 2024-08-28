import { CommonActions } from "@react-navigation/native"
import { navigationRef } from "../navigation/appNavigation"


export const navigateToScreen = (screenName, params) => {
    navigationRef.current?.navigate(screenName, params)
}

export const resetRoute = (screenName) => {
    const baseRoute = [{ name: 'BottomNavigate' } ]
    navigationRef.current.dispatch(
        CommonActions.reset({
        index: screenName ? 1 : 0,
        routes: screenName ? [...baseRoute, {name: screenName}] : baseRoute,
        })
    );
}