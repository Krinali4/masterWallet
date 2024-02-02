import PlacesAutocomplete,{geocodeByPlaceId,geocodeByAddress,getLatLng } from "react-places-autocomplete";
import { InputField } from "../inputfield/inputField";
interface IGeoLocation {
  address: any;
  handleChangeAddress: any;
  handleSelectAddress: any;
  readOnlyReturn: any;
  AutoLocation: any;
  placeholder: any;
}
const GeoLocationResults = ({
  address,
  handleChangeAddress,
  handleSelectAddress,
  readOnlyReturn,
  AutoLocation,
  placeholder,
}: IGeoLocation) => {
  console.log('address:'+address)
  return (
    <PlacesAutocomplete
      value={address}
      onChange={(v) => {
        console.log('onChange address:'+v)
        handleChangeAddress(v)
      }}
      onSelect={handleSelectAddress}
      searchOptions={{ types: [] }}
      shouldFetchSuggestions={true}
    >
      {({
        getInputProps,
        suggestions,
        getSuggestionItemProps,
        loading,
      }: any) => (
        <div>
          <InputField
            {...getInputProps({
              placeholder: placeholder,
            })}
            required={true}
            inputLabel={`${!readOnlyReturn() ? `Enter ` : ``}Address`}
            InputProps={{
              readOnly: readOnlyReturn(),
            }}
          />
          {/* <p>{`suggestions =>${suggestions.length}`}</p> */}
          <div
            className={
              suggestions.length === 0 ? " " : "autocomplete-dropdown-container"
            }
          >
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion: any) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              const style = suggestion.active
                ? {
                    backgroundColor: "#fafafa",
                    cursor: "pointer",
                    padding: "10px 15px",
                  }
                : {
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    padding: "10px 15px",
                  };
              return (
                <div
                  key={suggestion.placeId}
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span onClick={() => AutoLocation(suggestion)} >
                    {suggestion.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};
export default GeoLocationResults;
