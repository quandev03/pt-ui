
import { useQuery } from "@tanstack/react-query";
import { LayoutService } from "apps/Partner/src/components/layouts/services";
import { REACT_QUERY_KEYS } from "apps/Partner/src/constants/querykeys";

export function useGetProfileSimReplacement() {
    return useQuery({
      queryKey: [REACT_QUERY_KEYS.GET_PROFILE_OTHER],
      queryFn: () => {
        return LayoutService.getProfile();
      },
    });
  }