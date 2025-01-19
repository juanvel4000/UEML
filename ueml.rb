class UEML
  def initialize(file)
    @file = file
    @sections = {}
    @current_section = nil
    @multiline_value = false
    @current_key = nil
    @current_value = ""
  end

  def parse
    unless File.exist?(@file)
      raise "File not found: #{@file}"
    end

    File.readlines(@file).each_with_index do |line, index|
      line.strip!

      next if line.empty? || line.start_with?("//")

      if line.start_with?(">")
        @current_section = line[1..].strip
        @sections[@current_section] ||= {}
        next
      end

      if line.end_with?(";")
        line.chomp!(";")
        if @multiline_value
          @current_value += " " + line.strip
          @sections[@current_section][@current_key] = @current_value.strip
          @multiline_value = false
        else
          key, value = line.split("=", 2).map(&:strip)
          if key.nil? || value.nil?
            warn "Invalid key-value pair on line #{index + 1}"
            next
          end
          @sections[@current_section][key] = value
        end
      elsif line.end_with?("\\")
        @current_value += line.chomp("\\").strip
        @multiline_value = true
        @current_key ||= line.split("=", 2)[0].strip
      end
    end
  end

  def sections
    @sections
  end

  def save(file)
    File.open(file, 'w') do |f|
      @sections.each do |section, data|
        f.puts ">#{section}"
        data.each do |key, value|
          f.puts "#{key} = #{value};"
        end
      end
    end
  end
  def display
    @sections.each do |section, data|
      puts "[#{section}]"
      data.each do |key, value|
        puts "  #{key} = #{value}"
      end
      puts
    end
  end
end
