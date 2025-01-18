class UEMLParser
    def initialize(file)
      @file = file
      @sections = {}
      @current_section = nil
    end
  
    def parse
      File.readlines(@file).each_with_index do |line, index|
        line.strip!
  
        next if line.start_with?("//")
  
        if line.start_with?(">")
          @current_section = line[1..].strip
          @sections[@current_section] = {}
        else
          if line.end_with?(";")
            key, value = line.chomp(";").split("=", 2).map(&:strip)
            @sections[@current_section][key] = value
          end
        end
      end
    end
  
    def sections
      @sections
    end
  end
  