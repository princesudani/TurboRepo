const GenderTypes = ["male", "female", 'other'] as const;
type GenderTypes = (typeof GenderTypes);
 gender: GenderTypes | null

export type CategoryStatus= "male", | "female", | "others", | "health" | "home"
export type CategoryOption = {
  label: string;
  value: CategoryStatus;
}
export function useGetGenderOptions() {
    const genderOptions: GenderOption[] = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Others", value: "others" },
      ]
      return { genderOptions }
}

export const filterChangedFormFields = <T extends FormData>(
    allFields: T,
    dirtyFields: Record<keyof T, boolean | Record<string, unknown> | boolean[]>,
    initialValues?: FormData | null
): Partial<T> => {
    const keysToPick = (Object.keys(dirtyFields) as Array<keyof T>).filter(
        (key) => dirtyFields[key]
    );
    const result = _.pick(allFields, keysToPick);
    return {...result, id: initialValues?.id};
};

const HandleUpdateData = ({ options, draftBtn }: HandleAddDataProps) => {
    return useMutation({
        mutationKey: ['updateData'],
        mutationFn: async (formData: Partial<FormData>) => {
            const data = await axiosHttp.patch(`posts/${formData?.id}`, { ...formData, isDraft: draftBtn });
            return data;
        },
        ...options,
    });
}

const all = ["auth"] as string[]
export const authKeys = {

  login:  [...all, "login"],
};

const HandleGetData = ({ options, filterOption }: HandleGetDataProps) => {
    // await axiosHttp.patch(`posts?isDraft=${filterOption ? filterOption == 'draft' ? true : false : ''}`);
    const { isLoading, isError, data = [], refetch, isFetching } = useQuery<any>({
        queryKey: [...authKeys['login'], 'hello'],
        queryFn: async () => {
            const response = await axiosHttp.get(`posts?isDraft=${filterOption ? filterOption == 'draft' ? true : false : ''}`)
            if (!response) {
                throw new Error('Failed to fetch data')
            }
            return response
        },
        ...options
    })
    return {
        isLoading,
        isError,
        data,
        refetch,
        isFetching
    }
}

    const handleSubmit = React.useCallback(() => {
        console.log('formValues')
        ChildRef.current?.submitForm((formValues: Partial<FormData>) => {
            mutate(formValues);
        });
    }, []);
type ProductFormHandles = {
    submitForm: (onSubmit: (formValues: Partial<FormData>) => void) => void;
    resetForm: UseFormReset<FormData>
};
export const DataForm = React.forwardRef<ProductFormHandles, DataFormProps>(
    (
        { initialValues, selectedHobbies, draftBtn, setSelectedHobbies }: DataFormProps,
        ref: React.ForwardedRef<ProductFormHandles>
    ) => {
   React.useImperativeHandle(ref, () => ({
            submitForm(onSubmit) {
                handleSubmit((formValues) => {
                    const filterFormValues = filterChangedFormFields(
                        formValues,
                        dirtyFields,
                        formData
                    );
                    onSubmit(filterFormValues);
                })();
            },
            // handleTrigger: (data:any)=>data,
            resetForm: () => reset(),
        }));
)

DataForm.displayName = "DataForm";

const {
    field: { onChange, ...restField },
  } = useController({ name, control, defaultValue, rules });

  const selectedValues: string[] = useWatch({ control, name }) || [];

  const handleChange = (value: string) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(updatedValues);
  };

  return (
    <Stack gap="5px">
      {label && <span>{label}</span>}
      <Stack gap="45px" direction="row">
        {options.map((option) => (
          <FormControlLabel
            control={
              <Checkbox
                icon={<BoxStyled size={size} />}
                checkedIcon={<CheckStyled size={size} />}
                checked={selectedValues.includes(option.value)}
                {...restField}
                value={option.value}
                onChange={() => handleChange(option.value)}
              />
            }
            label={option.label}
            key={option.value}
          />
        ))}
      </Stack>
{error && helperText && (
        <FormHelperText error>{helperText}</FormHelperText>
      )}
    </Stack>
  );

const api = {
    get: <T>(endpoint: string, params = {}): Promise<AxiosResponse<T>> =>
        axiosHttp.get(endpoint, { params }),

    post: <T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> =>
        axiosHttp.post(endpoint, data),

    put: <T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> =>
        axiosHttp.put(endpoint, data),

    patch: <T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> =>
        axiosHttp.patch(endpoint, data),

    delete: <T>(endpoint: string): Promise<AxiosResponse<T>> =>
        axiosHttp.delete(endpoint),
};

onsuccess ma
 queryClient.invalidateQueries({
                    queryKey: ['getData']
                })
