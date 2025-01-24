type HobbyOption = { label: string, value: string}

export function useGetHobbyGroupOptions() {
    const hobbyGroupOptions: HobbyOption[] = [
      { label: "Reading", value: "reading" },
      { label: "Writing", value: "writing" },
      { label: "Coding", value: "coding" },
      { label: "Gaming", value: "gaming" },
    ];  

    return {hobbyGroupOptions};
  }
  