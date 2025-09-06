import * as React from "react";
import { CheckIcon, ChevronsUpDown, Search } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex group", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          value={value || undefined}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      "rounded-e-lg rounded-s-none border-l-0 bg-white/80 backdrop-blur-sm",
      "focus:ring-2 focus:ring-primary/20 focus:border-primary",
      "transition-all duration-200 ease-in-out",
      "group-hover:bg-white/90",
      className
    )}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        open && setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "relative flex gap-2 rounded-e-none rounded-s-lg border-r-0 px-3",
            "bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm",
            "hover:from-white/90 hover:to-white/70",
            "focus:z-10 focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "transition-all duration-200 ease-in-out",
            "shadow-sm hover:shadow-md",
            "group",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
          >
            <FlagComponent
              country={selectedCountry}
              countryName={selectedCountry}
            />
          </motion.div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronsUpDown
              className={cn(
                "-mr-2 size-4 transition-all duration-200",
                disabled ? "hidden" : "opacity-70 group-hover:opacity-100"
              )}
            />
          </motion.div>

          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-s-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </Button>
      </PopoverTrigger>

      <AnimatePresence>
        {isOpen && (
          <PopoverContent className="w-[320px] p-0 border-0 shadow-2xl" asChild>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-lg border shadow-2xl">
                <Command className="bg-transparent sticky top-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                    <CommandInput
                      value={searchValue}
                      onValueChange={(value) => {
                        setSearchValue(value);
                        setTimeout(() => {
                          if (scrollAreaRef.current) {
                            const viewportElement =
                              scrollAreaRef.current.querySelector(
                                "[data-radix-scroll-area-viewport]"
                              );
                            if (viewportElement) {
                              viewportElement.scrollTop = 0;
                            }
                          }
                        }, 0);
                      }}
                      placeholder="Search country..."
                      className="border-0 bg-transparent focus:ring-0 focus:border-primary/30"
                    />
                  </div>

                  <CommandList>
                    <ScrollArea ref={scrollAreaRef} className="h-60">
                      <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <Search className="size-8 opacity-30" />
                          <p>No country found.</p>
                        </motion.div>
                      </CommandEmpty>

                      <CommandGroup>
                        {countryList.map(({ value, label }, index) =>
                          value ? (
                            <motion.div
                              key={value}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.01 }}
                              className="my-1"
                            >
                              <CountrySelectOption
                                country={value}
                                countryName={label}
                                selectedCountry={selectedCountry}
                                onChange={onChange}
                                onSelectComplete={() => setIsOpen(false)}
                              />
                            </motion.div>
                          ) : null
                        )}
                      </CommandGroup>
                    </ScrollArea>
                  </CommandList>
                </Command>
              </div>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  const isSelected = country === selectedCountry;

  return (
    <CommandItem
      className={cn(
        "gap-3 py-2 px-3 cursor-pointer",
        "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
        "transition-all duration-200 ease-in-out",
        "border-l-2 border-transparent hover:border-primary/20",
        isSelected &&
          "bg-gradient-to-r from-primary/15 to-primary/5 border-primary/40"
      )}
      onSelect={handleSelect}
    >
      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
        <FlagComponent country={country} countryName={countryName} />
      </motion.div>

      <span className="flex-1 text-sm font-medium">{countryName}</span>

      <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0 rounded">
        {`+${RPNInput.getCountryCallingCode(country)}`}
      </span>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isSelected ? 1 : 0 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
      >
        <CheckIcon className="size-4 text-primary" />
      </motion.div>
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span
      className={cn(
        "flex h-5 w-6 overflow-hidden rounded-none",
        "bg-gradient-to-br from-muted/30 to-muted/50",
        "shadow-sm",
        "transition-all duration-200",
        "[&_svg:not([class*='size-'])]:size-full"
      )}
    >
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
