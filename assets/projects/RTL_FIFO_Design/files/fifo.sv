module fifo #(
    parameter WIDTH = 8,
    parameter DEPTH = 32,
    parameter POINTER_WIDTH = $clog2(DEPTH)
)(
    input logic clk, rst,
    // Write side
    input logic w_en,
    input logic [WIDTH-1:0] data_in,
    output logic full,

    // Read side
    input logic r_en,
    output logic [WIDTH-1:0] data_out,
    output logic empty
);

    logic [WIDTH-1:0] mem [0:DEPTH-1];
    logic [POINTER_WIDTH :0] wr_ptr;  // Extra bit to differentiate between full and empty
    logic [POINTER_WIDTH :0] rd_ptr;  // Extra bit to differentiate between full and empty
 
    always_ff @(posedge clk or posedge rst) begin
        if (rst) begin
            wr_ptr <= '0;
            rd_ptr <= '0;
            data_out <= '0; 
        end
        else  begin
            if (w_en && !full) begin
                mem[wr_ptr[POINTER_WIDTH-1:0]] <= data_in;
                wr_ptr <= wr_ptr + 1;
            end
            if (r_en && !empty) begin
                data_out <= mem[rd_ptr[POINTER_WIDTH-1:0]];
                rd_ptr <= rd_ptr + 1;
            end

        end
    end


    // Flag logic

    always_comb begin
        full = 1'b0;
        empty = 1'b0;
        if (wr_ptr == rd_ptr) begin
            empty = 1'b1;
        end
        else if (wr_ptr[POINTER_WIDTH] != rd_ptr[POINTER_WIDTH] && wr_ptr[POINTER_WIDTH-1:0] == rd_ptr[POINTER_WIDTH-1:0]) begin
            full = 1'b1;
        end
    end

endmodule